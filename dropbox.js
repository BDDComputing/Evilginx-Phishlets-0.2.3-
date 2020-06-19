define(["require", "exports", "tslib", "react", "modules/core/i18n", "modules/core/browser", "modules/core/exception", "modules/clean/ajax", "modules/clean/auth/common/types", "modules/clean/auth/common/utils", "modules/clean/auth/register/types", "modules/clean/auth/register/view", "modules/clean/marketing_tracker", "modules/clean/form_util/name_parser", "modules/clean/profile_services/auth_callback_handler", "modules/clean/profile_services/profile_services_constants", "modules/clean/profile_services/profile_services_link", "modules/clean/react/css", "modules/clean/web_timing_logger", "modules/clean/web_register_logging_data", "modules/clean/auth/common/stats", "modules/clean/api_v2/noauth_client", "modules/core/notify"], (function(e, t, s, i, r, n, a, o, l, m, p, g, c, u, d, h, _, f, v, S, E, R, C) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    }), i = s.__importDefault(i), n = s.__importStar(n), a = s.__importStar(a), o = s.__importStar(o), u = s.__importDefault(u), h = s.__importDefault(h);
    var y = (function(e) {
        function t(t) {
            var i = e.call(this, t) || this;
            i.testOnlyGetViewComponent = function() {
                return i.viewComponent
            }, i.setViewComponent = function(e) {
                i.viewComponent = e
            }, i.onClickSignUp = function(e) {
                e.preventDefault(), i.handleRegisterFormEvent(p.RegisterFormEvent.REGISTER_CLICK), E.EmailAuthUXAnalyticsLogger.logSignupStart();
                var t = i.getFormErrors();
                t.fname || t.email || t.password || t.tos ? i.setState({
                    localErrors: t
                }) : i.viewComponent.getRecaptchaComponent().getWrappedComponent().submit()
            }, i.onSubmit = function() {
                i.setState({
                    isSubmitting: !0
                });
                var e = i.registerData(),
                    t = i.thirdPartySignupInitiated ? "/ajax_thirdparty_register" : "/ajax_register";
                o.WebRequest({
                    url: t,
                    type: "POST",
                    data: e,
                    success: function(e, t, s) {
                        i.handleSuccess(e)
                    },
                    error: function(e, t, s) {
                        i.handleServerErrors(JSON.parse(s))
                    }
                })
            }, i.handleGoogleCallback = function(e) {
                E.GoogleUXAnalyticsLogger.logSignupResponse(e);
                var t = i.props,
                    r = t.additionalParams,
                    n = void 0 === r ? {} : r,
                    a = t.marketingOptInProps,
                    o = void 0 === a ? {} : a,
                    l = t.canRedirect,
                    m = i.props.googleRegisterProps || {},
                    g = m.signupContinuationUrl || "/",
                    c = S.getWebRegisterLoggingData();
                d.handleRegisterResponse(e, s.__assign({
                    showMarketingOptIn: !!o.show,
                    registerCont: g,
                    loginCont: m.optimisticLoginContinuationUrl || g,
                    signupTag: n.signup_tag || "",
                    canRedirect: !1 !== l,
                    k: n.k,
                    eh: n.eh,
                    signupEndpoint: i.props.signupEndpoint,
                    inlineRedirect: l ? void 0 : function(e) {
                        var t = e.fname,
                            r = e.lname,
                            n = e.email,
                            a = s.__rest(e, ["fname", "lname", "email"]);
                        i.setState({
                            fname: t,
                            lname: r,
                            email: n,
                            inlineThirdPartySignupState: a
                        })
                    }
                }, c), void 0, (function() {
                    return i.handleRegisterFormEvent(p.RegisterFormEvent.GOOGLE_REGISTER_SUCCESS)
                }), (function(e) {
                    return i.handleRegisterFormEvent(p.RegisterFormEvent.REGISTER_IMMEDIATE_SUCCESS, {
                        userInfo: e
                    }), i.props.onRegisterSuccess && i.props.onRegisterSuccess(e, e)
                }))
            }, i.onGoogleRegisterClick = function() {
                i.handleRegisterFormEvent(p.RegisterFormEvent.REGISTER_CLICK), E.GoogleUXAnalyticsLogger.logSignupStart();
                var e = !i.props.googleRegisterProps || i.props.googleRegisterProps.popup;
                (new _.ProfileServicesLinkingHandler).auth_service_create_user_if_needed(h.default.GOOGLE, i.handleGoogleCallback, "register_form", e)
            }, i.onInputChange = function(e) {
                var t = {},
                    s = e.currentTarget,
                    r = s.name,
                    n = s.value,
                    a = s.checked;
                "fname" === r ? t.fname = n : "lname" === r ? t.lname = n : "email" === r ? t.email = n : "password" === r ? t.password = n : "tos_agree" === r ? t.tosAgree = a : "marketing_opt_in" === r && (t.marketingOptIn = a), i.setState(t), i.clearFormErrors(t)
            }, i.handleResendClick = function(e) {
                var t = e.target,
                    s = i.state,
                    r = s.email,
                    n = s.isSendingInvite;
                "login-register-resend-invite" === t.className && I(e, n, r, (function() {
                    return i.setState({
                        isSendingInvite: !0
                    })
                }), (function() {
                    return i.setState({
                        isSendingInvite: !1
                    })
                }))
            }, a.assert(!1 !== t.canRedirect || !!t.onRegisterSuccess, "Need an on register success handler if we cannot redirect the user", {
                tags: ["react-register-form"]
            });
            var r = t.fnameProps,
                n = void 0 === r ? {} : r,
                l = t.lnameProps,
                m = void 0 === l ? {} : l,
                g = t.emailProps,
                c = void 0 === g ? {} : g,
                u = t.tosCheckboxProps,
                f = void 0 === u ? {} : u,
                v = t.marketingOptInProps,
                R = void 0 === v ? {} : v,
                C = !R.show || !!R.checked;
            return i.state = {
                localErrors: {},
                isSubmitting: !1,
                fname: n.initialValue || "",
                lname: m.initialValue || "",
                email: c.initialValue || "",
                password: "",
                tosAgree: !!f.checked,
                isSendingInvite: !1,
                marketingOptIn: C
            }, i.mounted = !1, i
        }
        return s.__extends(t, e), t.prototype.handleServerErrors = function(e) {
            if (this.mounted && !this.viewComponent.handleRecaptchaErrors(e)) {
                E.EmailAuthUXAnalyticsLogger.logSignupError();
                var t = s.__assign({}, this.state.localErrors);
                e.email && (t.email = e.email), e.password && (t.password = e.password), e.fname && (t.fname = e.fname), e.tos_agree && (t.tos = e.tos_agree), this.setState({
                    localErrors: t
                }), this.setState({
                    isSubmitting: !1
                })
            }
        }, t.prototype.handleSuccess = function(e) {
            if (this.mounted) {
                var t = JSON.parse(e),
                    s = {
                        id: t.id,
                        email: t.email,
                        display_name: t.display_name
                    };
                if (E.EmailAuthUXAnalyticsLogger.logSignupResponse(), this.handleRegisterFormEvent(p.RegisterFormEvent.REGISTER_IMMEDIATE_SUCCESS, {
                        userInfo: s
                    }), !1 !== this.props.canRedirect) {
                    var i = this.props.continuationUrlForNonGoogleSignup || t.redirect_url || "/";
                    n.redirect(i)
                } else this.props.onRegisterSuccess && this.props.onRegisterSuccess(s, t);
                this.setState({
                    isSubmitting: !1
                })
            }
        }, t.prototype.trackSuccessfulRegister = function(e, t) {
            if (e === p.RegisterFormEvent.GOOGLE_REGISTER_SUCCESS || e === p.RegisterFormEvent.REGISTER_IMMEDIATE_SUCCESS) {
                var s = c.getGAViewData(c.MARKETING_REGISTER_EVENT, "ga_register_pageview", "/virtual/ga_register_pageview");
                c.MarketingTracker.tryPushEvent(c.MARKETING_REGISTER_EVENT, c.EventTypeEnum.View, s)
            }
        }, t.prototype.handleRegisterFormEvent = function(e, t) {
            this.trackSuccessfulRegister(e, t), this.props.onRegisterFormEvent && this.props.onRegisterFormEvent(e, t)
        }, t.prototype.getFormattedName = function() {
            var e = this.state,
                t = e.fname,
                s = e.lname;
            return this.props.combinedName ? m.lastNameGoesFirst() ? [s, t] : u.default.splitFullName(t) : [t, s]
        }, t.prototype.registerData = function() {
            var e = this.getFormattedName(),
                t = e[0],
                i = e[1],
                r = n.get_uri().getQuery(),
                a = this.state,
                o = a.email,
                l = a.password,
                m = a.tosAgree,
                p = a.marketingOptIn,
                g = a.inlineThirdPartySignupState,
                c = this.props,
                u = c.additionalParams,
                d = c.thirdPartyInitiatedSignupData,
                h = s.__assign({
                    fname: t,
                    lname: i,
                    email: o,
                    tos_agree: m
                }, this.thirdPartySignupInitiated ? {} : {
                    password: l
                }),
                _ = s.__assign(s.__assign(s.__assign(s.__assign(s.__assign({
                    signup_endpoint: this.props.signupEndpoint,
                    demandbase_override: r.demandbase_override,
                    marketing_opt_in: p
                }, h), d || {}), g || {}), this.viewComponent && this.viewComponent.getRecaptchaResponses() || {}), u);
            return S.setWebRegisterLoggingData(_)
        }, t.prototype.clearFormErrors = function(e) {
            var t = this.state.localErrors;
            e.fname && (t.fname = {}), e.email && (t.email = {}), e.password && (t.password = {}), e.tosAgree && (t.tos = {}), this.setState({
                localErrors: t
            })
        }, t.prototype.getFormErrors = function() {
            var e = {};
            return this.props.validateClientSide ? (this.state.fname ? e.fname = void 0 : e.fname = {
                message_text: r.intl.formatMessage({
                    id: "GlyhO1",
                    defaultMessage: "Please enter your name"
                })
            }, this.state.email ? e.email = void 0 : e.email = {
                message_text: r.intl.formatMessage({
                    id: "I7g4FQ",
                    defaultMessage: "Please enter an email address"
                })
            }, this.state.password ? e.password = void 0 : e.password = {
                message_text: r.intl.formatMessage({
                    id: "LhlWCW",
                    defaultMessage: "Please enter a password"
                })
            }, this.state.tosAgree ? e.tos = void 0 : e.tos = {
                message_text: r.intl.formatMessage({
                    id: "yw3Lbd",
                    defaultMessage: "Please agree to the terms of service"
                })
            }, e) : e
        }, Object.defineProperty(t.prototype, "thirdPartySignupInitiated", {
            get: function() {
                return !!this.props.thirdPartyInitiatedSignupData || !!this.state.inlineThirdPartySignupState
            },
            enumerable: !0,
            configurable: !0
        }), t.prototype.componentDidMount = function() {
            this.props.markTti && v.mark_time_to_interactive(), this.mounted = !0, document.addEventListener("click", this.handleResendClick)
        }, t.prototype.componentWillUnmount = function() {
            this.mounted = !1, document.removeEventListener("click", this.handleResendClick)
        }, t.prototype.render = function() {
            var e = this.props,
                t = e.marketingOptInProps,
                s = void 0 === t ? {} : t,
                r = e.variant,
                n = e.emailProps,
                a = e.maestroStyle,
                o = e.disabled,
                m = e.className,
                p = e.combinedName,
                c = e.fnameProps,
                u = e.lnameProps,
                d = e.passwordProps,
                h = e.tosCheckboxProps,
                _ = e.submitButtonProps,
                f = e.googleRegisterProps;
            return i.default.createElement(g.RegisterFormView, {
                ref: this.setViewComponent,
                variant: r || l.AuthFormVariant.STANDARD,
                maestroStyle: !!a,
                disabled: !!o,
                className: m,
                combinedName: !!p,
                fnameProps: c || {},
                fnameValue: this.state.fname,
                fnameError: this.state.localErrors.fname,
                lnameProps: u || {},
                lnameValue: this.state.lname,
                emailProps: n || {},
                emailValue: this.state.email,
                emailError: this.state.localErrors.email,
                passwordProps: d || {},
                passwordValue: this.state.password,
                passwordError: this.state.localErrors.password,
                tosCheckboxProps: h || {},
                tosChecked: this.state.tosAgree,
                tosError: this.state.localErrors.tos,
                submitButtonProps: _ || {},
                googleRegisterProps: f,
                thirdPartyInitiatedSignup: this.thirdPartySignupInitiated,
                isSubmitting: this.state.isSubmitting,
                onClickSignUp: this.onClickSignUp,
                onInputChange: this.onInputChange,
                onSubmit: this.onSubmit,
                onGoogleRegisterClick: this.onGoogleRegisterClick,
                showMarketingOptIn: !!s.show,
                marketingOptInChecked: this.state.marketingOptIn
            })
        }, t
    })(i.default.Component);

    function I(e, t, s, i, n) {
        if (!0 !== t) {
            var a = new R.NoAuthApiV2Client;
            i(), a.ns("team").rpc("logged_out_resend_pending_invite_email", {
                email: s
            }, {}).then((function() {
                C.Notify.success(r.intl.formatMessage({
                    id: "un5VKD",
                    defaultMessage: "Invite resent to {email}"
                }, {
                    email: s
                })), n()
            })).catch((function(e) {
                C.Notify.error(r.intl.formatMessage({
                    id: "yqLGvW",
                    defaultMessage: "Failed to resend invite."
                })), n()
            })), e.preventDefault()
        } else e.preventDefault()
    }
    t.TestOnlyRegisterFormComponent = y, t.handleInviteResendImpl = I, t.RegisterForm = f.requireCssWithComponent(y, ["/static/css/login_or_register-vfl1d3hl2.css", "/static/css/components/login_form-vflOHUpmF.css", "/static/css/components/button-vfloOTIBW.css"])
}));
//# sourceMappingURL=form.min.js-vfl8mQwqW.map