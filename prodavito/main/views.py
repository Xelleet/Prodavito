from django.shortcuts import render, redirect, get_object_or_404
from .forms import RegisterForm, AdForm
from .models import User, Profile, Ad
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login

def profile_view(request, index):
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

            return redirect('ad_list')  # замени на нужный URL
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
    ads = Ad.objects.all()
    print(request.user)
    return render(request, 'ads/ad_list.html', {'ads': ads})