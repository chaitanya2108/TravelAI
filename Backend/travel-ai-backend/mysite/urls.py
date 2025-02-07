"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .itinerary_generator import ItineraryGenerator
import json

generator = ItineraryGenerator()

@csrf_exempt
def process_input(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            itinerary = generator.create_itinerary(data)
            return JsonResponse({
                'response': itinerary,
                'message': 'Itinerary generated successfully'
            })
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/process-input/', process_input, name='process_input'),
]
