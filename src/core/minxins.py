class DeprecatedAPIMixin:
    deprecation_message = "This endpoint is deprecated."
    alternative_url = None

    def finalize_response(self, request, response, *args, **kwargs):
        response = super().finalize_response(request, response, *args, **kwargs)
        response["Deprecation"] = "true"
        if self.alternative_url:
            response["Link"] = f'<{self.alternative_url}>; rel="alternative_url"'
        response["Warning"] = f'299 - "{self.deprecation_message}"'
        return response
