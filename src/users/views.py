from django.shortcuts import redirect
from django_registration.backends.one_step.views import RegistrationView
from django.utils.timezone import localdate

from users.form import InviteForm
from users.models import InviteToken


class InviteView(RegistrationView):
    form_class = InviteForm

    def dispatch(self, *args, **kwargs):
        try:
            self.tokenObj = InviteToken.objects.get(
                token=kwargs.get("token"), expire=False
            )
        except InviteToken.DoesNotExist:
            return redirect("/inviteNotValid/")
        return super().dispatch(*args, **kwargs)

    def register(self, form):
        new_user = super().register(form)
        self.tokenObj.expire = True
        self.tokenObj.new_user = new_user
        self.tokenObj.date_of_use = localdate()
        self.tokenObj.save()

        return new_user
