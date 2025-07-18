from django.shortcuts import render, redirect, get_object_or_404
from .forms import RegisterForm, AdForm, ExchangeProposalForm, MessageForm
from .models import User, Profile, Ad, ExchangeProposal, Message
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.db.models import Q

def profile_view(request, index):
    try:
        Profile.objects.get(id=index)
    except Exception as e:
        return render(request, 'error.html', {'error': e})
    return render(request, 'profile.html', {'profile': Profile.objects.get(id=index)})

def register_view(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = RegisterForm()

    return render(request, 'register.html', {'form': form})


def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)

            return redirect('ad_list')
        else:
            # Неверные данные
            return render(request, 'login.html', {
                'error': 'Неверное имя пользователя или пароль'
            })

    return render(request, 'login.html')

@login_required()
def ad_create(request):
    if request.method == 'POST':
        form = AdForm(request.POST)
        if form.is_valid():
            ad = form.save(commit=False)
            ad.user = request.user
            ad.save()
            return redirect('ad_list')
    else:
        form = AdForm()

    return render(request, 'ads/ad_form.html', {'form': form})

def ad_update(request, pk):
    ad = get_object_or_404(Ad, pk=pk)
    if request.method == 'POST':
        form = AdForm(request.POST, instance=ad)
        if form.is_valid():
            form.save()
            return redirect('ad_list')
    else:
        form = AdForm(instance=ad)
    return render(request, 'ads/ad_form.html', {'form': form})

def ad_delete(request, pk):
    ad = get_object_or_404(Ad, pk=pk)
    if request.method == 'POST':
        ad.delete()
        return redirect('ad_list')
    return render(request, 'ads/ad_confirm_delete.html', {'ad': ad})

def ad_list(request):
    query = request.GET.get('q')
    category = request.GET.get('category')
    condition = request.GET.get('condition')
    ads = Ad.objects.all()
    if query:
        ads = ads.filter(Q(title__icontains=query) | Q(description__icontains=query))
    if category:
        ads = ads.filter(category__iexact=category)
    if condition:
        ads = ads.filter(condition=condition)
    paginator = Paginator(ads, 10)
    page = request.GET.get('page')
    try:
        ads_page = paginator.page(page)
    except PageNotAnInteger:
        ads_page = paginator.page(1)
    except EmptyPage:
        ads_page = paginator.page(paginator.num_pages)
    return render(request, 'ads/ad_list.html', {'ads': ads, 'query': query, 'filter_category': category, 'filter_condition': condition})

@login_required()
def create_exchange_proposal(request):
    if request.method == 'POST':
        form = ExchangeProposalForm(request.POST, user=request.user)
        if form.is_valid():
            proposal = form.save(commit=False)
            if proposal.ad_sender == proposal.ad_receiever:
                form.add_error(None, 'Нельзя обменять объявление на само себя')
            else:
                proposal.save()
                return redirect('proposal_detail', pk=proposal.pk)
    else:
        form = ExchangeProposalForm(user=request.user)
    return render(request, 'exchange/proposal_form.html', {'form': form})

@login_required()
def proposal_detail(request, pk):
    proposal = get_object_or_404(ExchangeProposal, pk=pk)
    if request.user not in [proposal.ad_sender.user, proposal.ad_receiever.user]:
        return redirect('ad_list')
    return render(request, 'exchange/proposal_detail.html', {'proposal': proposal})

@login_required()
def update_proposal_status(request, pk):
    proposal = get_object_or_404(ExchangeProposal, pk=pk)
    if request.user != proposal.ad_receiever.user:
        return redirect('proposal_detail', pk=pk)
    if request.method == 'POST':
        new_status = request.POST.get('status')
        if new_status in dict(ExchangeProposal.STATUS_CHOICES):
            proposal.status = new_status
            proposal.save()
            if new_status == 'accepted':
                proposal.ad_sender.user.email_user(
                    'Ваше предложение обмена принято',
                    f'Пользователь принял обмен между "{proposal.ad_sender.title}" и "{proposal.ad_receiever.title}"'
                )
                return redirect('proposal_detail', pk=pk)
    return render(request, 'exchange/update_status.html', {'proposal': proposal})

@login_required()
def my_proposals(request):
    proposal_sent = ExchangeProposal.objects.filter(ad_sender_user=request.user)
    proposal_received = ExchangeProposal.objects.filter(ad_receiver_user=request.user)
    return render(request, 'exchange/my_proposals.html', {
        'proposals_sent': proposal_sent,
        'proposals_received': proposal_received
    })

@login_required()
def send_message(request, user_id):
    if request.method == 'POST':
        form = MessageForm(request.POST)
        if form.is_valid():
            message = form.save(commit=False)
            message.sender = request.user
            message.receiver = get_object_or_404(User, id=user_id)
            message.save()
            return redirect('chat_with', user_id=message.receiver.id)
    else:
        form = MessageForm()

    return render(request, 'chat/send_message.html', {'form': form, 'receiver': get_object_or_404(User, id=user_id)})

@login_required
def chat_with(request, user_id):
    other_user = get_object_or_404(User, id=user_id)
    messages = Message.objects.filter(
        (Q(sender=request.user) & Q(receiver=other_user)) |
        (Q(sender=other_user) & Q(receiver=request.user))
    ).order_by('created_at')

    Message.objects.filter(receiver=request.user, sender=other_user, is_read=False).update(is_read=True)

    if request.method == 'POST':
        content = request.POST.get('content')
        if content:
            Message.objects.create(sender=request.user, receiver=other_user, content=content)
            return redirect('chat_with', user_id=user_id)

    return render(request, 'chat/chat_detail.html', {
        'messages': messages,
        'other_user': other_user
    })

@login_required
def inbox(request):
    sent_users = User.objects.filter(sent_messages__receiver=request.user).distinct()
    received_users = User.objects.filter(received_messages__sender=request.user).distinct()
    users = (sent_users | received_users).distinct().exclude(id=request.user.id)
    return render(request, 'chat/inbox.html', {'users': users})
