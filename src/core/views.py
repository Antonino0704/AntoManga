from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic.base import TemplateView

class IndexTemplate(LoginRequiredMixin, TemplateView):

    def get_template_names(self):
        return "index.html"