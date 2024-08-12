from django.urls import path
from . import views

urlpatterns = [
    path("documents/", views.DocumentListCreate.as_view(), name="document-list"),
    path("documents/preview/", views.PreviewList.as_view(), name="preview-list"),
    path("documents/delete/<int:pk>/", views.DocumentDelete.as_view(), name="delete-document"),
    path("documents/update/<int:pk>/", views.DocumentUpdate.as_view(), name="update-document"),
    path("github/", views.GithubSignInView.as_view(), name="github")
]

