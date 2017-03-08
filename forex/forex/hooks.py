# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "imports"
app_title = "Imports"
app_publisher = "FinByz"
app_description = "App for managing Imports"
app_icon = "octicon octicon-cloud-download"
app_color = "red"
app_email = "info@finbyz.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/imports/css/imports.css"
# app_include_js = "/assets/imports/js/imports.js"

# include js, css files in header of web template
# web_include_css = "/assets/imports/css/imports.css"
# web_include_js = "/assets/imports/js/imports.js"

# Home Pages
# ----------

# application home page (will override Website Settings)
# home_page = "login"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "imports.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "imports.install.before_install"
# after_install = "imports.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "imports.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

doc_events = {
	"Payment Entry": {
		"on_submit": "forex.api.payment_on_submit",
		"on_cancel": "forex.api.payment_on_cancel"	
	}
}


# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"imports.tasks.all"
# 	],
# 	"daily": [
# 		"imports.tasks.daily"
# 	],
# 	"hourly": [
# 		"imports.tasks.hourly"
# 	],
# 	"weekly": [
# 		"imports.tasks.weekly"
# 	]
# 	"monthly": [
# 		"imports.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "imports.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "imports.event.get_events"
# }

