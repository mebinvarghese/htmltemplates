/* tslint:disable:max-line-length */
import { TreoNavigationItem } from '@treo/components/navigation';

export const defaultNavigation: TreoNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        subtitle: 'Unique dashboard designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id   : 'dashboards.finance',
                title: 'Finance',
                type : 'basic',
                icon : 'heroicons_outline:cash',
                link : '/dashboards/finance'
            },
            {
                id   : 'dashboards.analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/dashboards/analytics'
            },
            {
                id   : 'dashboards.crypto',
                title: 'Crypto',
                type : 'basic',
                icon : 'heroicons_outline:currency-dollar',
                link : '/dashboards/crypto'
            }
        ]
    },
    {
        id      : 'applications',
        title   : 'Applications',
        subtitle: 'Custom made application designs',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [
            {
                id      : 'applications.calendar',
                title   : 'Calendar',
                subtitle: '3 upcoming events',
                type    : 'basic',
                icon    : 'heroicons_outline:calendar',
                link    : '/apps/calendar'
            },
            {
                id   : 'applications.contacts',
                title: 'Contacts',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/apps/contacts'
            },
            {
                id      : 'applications.ecommerce',
                title   : 'ECommerce',
                type    : 'collapsable',
                icon    : 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id   : 'applications.ecommerce.inventory',
                        title: 'Inventory',
                        type : 'basic',
                        link : '/apps/ecommerce/inventory'
                    }
                ]
            },
            {
                id   : 'applications.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title     : '27',
                    style     : 'rounded',
                    background: '#E91E63',
                    color     : '#FFFFFF'
                }
            },
            {
                id   : 'applications.tasks',
                title: 'Tasks',
                type : 'basic',
                icon : 'heroicons_outline:check-circle',
                link : '/apps/tasks'
            }
        ]
    },
    {
        id      : 'pages',
        title   : 'Pages',
        subtitle: 'Custom made page designs',
        type    : 'group',
        icon    : 'heroicons_outline:document',
        children: [
            {
                id      : 'pages.authentication',
                title   : 'Authentication',
                type    : 'collapsable',
                icon    : 'heroicons_outline:lock-closed',
                children: [
                    {
                        id      : 'pages.authentication.sign-in',
                        title   : 'Sign in',
                        type    : 'collapsable',
                        children: [
                            {
                                id   : 'pages.authentication.sign-in.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/sign-in/classic'
                            },
                            {
                                id   : 'pages.authentication.sign-in.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/sign-in/modern'
                            },
                            {
                                id   : 'pages.authentication.sign-in.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-in/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.sign-in.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/sign-in/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.sign-in.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-in/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.sign-up',
                        title   : 'Sign up',
                        type    : 'collapsable',
                        link    : '/pages/authentication/sign-up',
                        children: [
                            {
                                id   : 'pages.authentication.sign-up.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/sign-up/classic'
                            },
                            {
                                id   : 'pages.authentication.sign-up.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/sign-up/modern'
                            },
                            {
                                id   : 'pages.authentication.sign-up.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-up/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.sign-up.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/sign-up/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.sign-up.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-up/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.sign-out',
                        title   : 'Sign out',
                        type    : 'collapsable',
                        link    : '/pages/authentication/sign-out',
                        children: [
                            {
                                id   : 'pages.authentication.sign-out.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/sign-out/classic'
                            },
                            {
                                id   : 'pages.authentication.sign-out.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/sign-out/modern'
                            },
                            {
                                id   : 'pages.authentication.sign-out.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-out/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.sign-out.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/sign-out/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.sign-out.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/sign-out/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.forgot-password',
                        title   : 'Forgot password',
                        type    : 'collapsable',
                        link    : '/pages/authentication/forgot-password',
                        children: [
                            {
                                id   : 'pages.authentication.forgot-password.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/forgot-password/classic'
                            },
                            {
                                id   : 'pages.authentication.forgot-password.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/forgot-password/modern'
                            },
                            {
                                id   : 'pages.authentication.forgot-password.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/forgot-password/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.forgot-password.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/forgot-password/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.forgot-password.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/forgot-password/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.reset-password',
                        title   : 'Reset password',
                        type    : 'collapsable',
                        link    : '/pages/authentication/reset-password',
                        children: [
                            {
                                id   : 'pages.authentication.reset-password.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/reset-password/classic'
                            },
                            {
                                id   : 'pages.authentication.reset-password.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/reset-password/modern'
                            },
                            {
                                id   : 'pages.authentication.reset-password.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/reset-password/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.reset-password.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/reset-password/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.reset-password.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/reset-password/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.unlock-session',
                        title   : 'Unlock session',
                        type    : 'collapsable',
                        link    : '/pages/authentication/unlock-session',
                        children: [
                            {
                                id   : 'pages.authentication.unlock-session.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/unlock-session/classic'
                            },
                            {
                                id   : 'pages.authentication.unlock-session.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/unlock-session/modern'
                            },
                            {
                                id   : 'pages.authentication.unlock-session.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/unlock-session/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.unlock-session.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/unlock-session/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.unlock-session.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/unlock-session/fullscreen-alt'
                            }
                        ]
                    },
                    {
                        id      : 'pages.authentication.confirmation-required',
                        title   : 'Confirmation required',
                        type    : 'collapsable',
                        link    : '/pages/authentication/confirmation-required',
                        children: [
                            {
                                id   : 'pages.authentication.confirmation-required.classic',
                                title: 'Classic',
                                type : 'basic',
                                link : '/pages/authentication/confirmation-required/classic'
                            },
                            {
                                id   : 'pages.authentication.confirmation-required.modern',
                                title: 'Modern',
                                type : 'basic',
                                link : '/pages/authentication/confirmation-required/modern'
                            },
                            {
                                id   : 'pages.authentication.confirmation-required.modern-alt',
                                title: 'Modern Alt.',
                                type : 'basic',
                                link : '/pages/authentication/confirmation-required/modern-alt'
                            },
                            {
                                id   : 'pages.authentication.confirmation-required.fullscreen',
                                title: 'Fullscreen',
                                type : 'basic',
                                link : '/pages/authentication/confirmation-required/fullscreen'
                            },
                            {
                                id   : 'pages.authentication.confirmation-required.fullscreen-alt',
                                title: 'Fullscreen Alt.',
                                type : 'basic',
                                link : '/pages/authentication/confirmation-required/fullscreen-alt'
                            }
                        ]
                    }
                ]
            },
            {
                id      : 'pages.coming-soon',
                title   : 'Coming soon',
                type    : 'collapsable',
                icon    : 'heroicons_outline:clock',
                link    : '/pages/coming-soon',
                children: [
                    {
                        id   : 'pages.coming-soon.classic',
                        title: 'Classic',
                        type : 'basic',
                        link : '/pages/coming-soon/classic'
                    },
                    {
                        id   : 'pages.coming-soon.modern',
                        title: 'Modern',
                        type : 'basic',
                        link : '/pages/coming-soon/modern'
                    },
                    {
                        id   : 'pages.coming-soon.modern-alt',
                        title: 'Modern Alt.',
                        type : 'basic',
                        link : '/pages/coming-soon/modern-alt'
                    },
                    {
                        id   : 'pages.coming-soon.fullscreen',
                        title: 'Fullscreen',
                        type : 'basic',
                        link : '/pages/coming-soon/fullscreen'
                    },
                    {
                        id   : 'pages.coming-soon.fullscreen-alt',
                        title: 'Fullscreen Alt.',
                        type : 'basic',
                        link : '/pages/coming-soon/fullscreen-alt'
                    }
                ]
            },
            {
                id      : 'pages.errors',
                title   : 'Errors',
                type    : 'collapsable',
                icon    : 'heroicons_outline:exclamation-circle',
                children: [
                    {
                        id   : 'pages.errors.404',
                        title: '404',
                        type : 'basic',
                        link : '/pages/errors/404'
                    },
                    {
                        id   : 'pages.errors.500',
                        title: '500',
                        type : 'basic',
                        link : '/pages/errors/500'
                    }
                ]
            },
            {
                id      : 'pages.help-center',
                title   : 'Help center',
                type    : 'collapsable',
                icon    : 'heroicons_outline:question-mark-circle',
                link    : '/pages/help-center',
                children: [
                    {
                        id        : 'pages.help-center.home',
                        title     : 'Home',
                        type      : 'basic',
                        link      : '/pages/help-center',
                        exactMatch: true
                    },
                    {
                        id   : 'pages.help-center.faqs',
                        title: 'FAQs',
                        type : 'basic',
                        link : '/pages/help-center/faqs'
                    },
                    {
                        id   : 'pages.help-center.guides',
                        title: 'Guides',
                        type : 'basic',
                        link : '/pages/help-center/guides'
                    },
                    {
                        id   : 'pages.help-center.support',
                        title: 'Support',
                        type : 'basic',
                        link : '/pages/help-center/support'
                    }
                ]
            },
            {
                id   : 'pages.maintenance',
                title: 'Maintenance',
                type : 'basic',
                icon : 'heroicons_outline:exclamation',
                link : '/pages/maintenance'
            },
            {
                id      : 'pages.pricing',
                title   : 'Pricing',
                type    : 'collapsable',
                icon    : 'heroicons_outline:cash',
                children: [
                    {
                        id   : 'pages.pricing.modern',
                        title: 'Modern',
                        type : 'basic',
                        link : '/pages/pricing/modern'
                    },
                    {
                        id   : 'pages.pricing.simple',
                        title: 'Simple',
                        type : 'basic',
                        link : '/pages/pricing/simple'
                    },
                    {
                        id   : 'pages.pricing.single',
                        title: 'Single',
                        type : 'basic',
                        link : '/pages/pricing/single'
                    },
                    {
                        id   : 'pages.pricing.table',
                        title: 'Table',
                        type : 'basic',
                        link : '/pages/pricing/table'
                    }
                ]
            },
            {
                id   : 'pages.profile',
                title: 'Profile',
                type : 'basic',
                icon : 'heroicons_outline:user-circle',
                link : '/pages/profile'
            }
        ]
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        subtitle: 'Building blocks of the UI & UX',
        type    : 'group',
        icon    : 'heroicons_outline:collection',
        children: [
            {
                id   : 'user-interface.angular-material',
                title: 'Angular Material',
                type : 'basic',
                icon : 'heroicons_outline:shield-check',
                link : '/ui/angular-material'
            },
            {
                id   : 'user-interface.tailwindcss',
                title: 'TailwindCSS',
                type : 'basic',
                icon : 'heroicons_outline:sparkles',
                link : '/ui/tailwindcss'
            },
            {
                id   : 'user-interface.animations',
                title: 'Animations',
                type : 'basic',
                icon : 'heroicons_outline:play',
                link : '/ui/animations'
            },
            {
                id   : 'user-interface.cards',
                title: 'Cards',
                type : 'basic',
                icon : 'heroicons_outline:duplicate',
                link : '/ui/cards'
            },
            {
                id   : 'user-interface.colors',
                title: 'Colors',
                type : 'basic',
                icon : 'heroicons_outline:color-swatch',
                link : '/ui/colors'
            },
            {
                id      : 'user-interface.content-layouts',
                title   : 'Content layouts',
                type    : 'collapsable',
                icon    : 'heroicons_outline:template',
                children: [
                    {
                        id   : 'user-interface.content-layouts.overview',
                        title: 'Overview',
                        type : 'basic',
                        link : '/ui/content-layouts/overview'
                    },
                    {
                        id      : 'user-interface.content-layouts.fullwidth',
                        title   : 'Fullwidth',
                        type    : 'collapsable',
                        children: [
                            {
                                id   : 'user-interface.content-layouts.fullwidth.basic',
                                title: 'Basic',
                                type : 'basic',
                                link : '/ui/content-layouts/fullwidth/basic'
                            },
                            {
                                id   : 'user-interface.content-layouts.fullwidth.standard',
                                title: 'Standard',
                                type : 'basic',
                                link : '/ui/content-layouts/fullwidth/standard'
                            },
                            {
                                id   : 'user-interface.content-layouts.fullwidth.tabs',
                                title: 'Tabs',
                                type : 'basic',
                                link : '/ui/content-layouts/fullwidth/tabs'
                            },
                            {
                                id   : 'user-interface.content-layouts.fullwidth.tabs-navigation',
                                title: 'Tabs navigation',
                                type : 'basic',
                                link : '/ui/content-layouts/fullwidth/tabs-navigation'
                            }
                        ]
                    },
                    {
                        id      : 'user-interface.content-layouts.left-sidebar',
                        title   : 'Left Sidebar',
                        type    : 'collapsable',
                        children: [
                            {
                                id      : 'user-interface.content-layouts.left-sidebar.fullheight',
                                title   : 'Fullheight',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.fullheight.basic',
                                        title: 'Basic',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/fullheight/basic'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.fullheight.standard',
                                        title: 'Standard',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/fullheight/standard'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.fullheight.tabs',
                                        title: 'Tabs',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/fullheight/tabs'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.fullheight.tabs-navigation',
                                        title: 'Tabs navigation',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/fullheight/tabs-navigation'
                                    }
                                ]
                            },
                            {
                                id      : 'user-interface.content-layouts.left-sidebar.content',
                                title   : 'Content',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.content.standard',
                                        title: 'Standard',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/content/standard'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.content.tabs',
                                        title: 'Tabs',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/content/tabs'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.left-sidebar.content.tabs-navigation',
                                        title: 'Tabs navigation',
                                        type : 'basic',
                                        link : '/ui/content-layouts/left-sidebar/content/tabs-navigation'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id      : 'content-layouts.right-sidebar',
                        title   : 'Right Sidebar',
                        type    : 'collapsable',
                        children: [
                            {
                                id      : 'user-interface.content-layouts.right-sidebar.fullheight',
                                title   : 'Fullheight',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.fullheight.basic',
                                        title: 'Basic',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/fullheight/basic'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.fullheight.standard',
                                        title: 'Standard',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/fullheight/standard'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.fullheight.tabs',
                                        title: 'Tabs',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/fullheight/tabs'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.fullheight.tabs-navigation',
                                        title: 'Tabs navigation',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/fullheight/tabs-navigation'
                                    }
                                ]
                            },
                            {
                                id      : 'user-interface.content-layouts.right-sidebar.content',
                                title   : 'Content',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.content.standard',
                                        title: 'Standard',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/content/standard'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.content.tabs',
                                        title: 'Tabs',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/content/tabs'
                                    },
                                    {
                                        id   : 'user-interface.content-layouts.right-sidebar.content.tabs-navigation',
                                        title: 'Tabs navigation',
                                        type : 'basic',
                                        link : '/ui/content-layouts/right-sidebar/content/tabs-navigation'
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id   : 'user-interface.datatable',
                title: 'Datatable',
                type : 'basic',
                icon : 'heroicons_outline:view-list',
                link : '/ui/datatable'
            },
            {
                id      : 'user-interface.forms',
                title   : 'Forms',
                type    : 'collapsable',
                icon    : 'heroicons_outline:pencil-alt',
                children: [
                    {
                        id   : 'user-interface.forms.fields',
                        title: 'Fields',
                        type : 'basic',
                        link : '/ui/forms/fields'
                    },
                    {
                        id   : 'user-interface.forms.layouts',
                        title: 'Layouts',
                        type : 'basic',
                        link : '/ui/forms/layouts'
                    },
                    {
                        id   : 'user-interface.forms.wizards',
                        title: 'Wizards',
                        type : 'basic',
                        link : '/ui/forms/wizards'
                    }
                ]
            },
            {
                id   : 'user-interface.helpers',
                title: 'Helpers',
                type : 'basic',
                icon : 'heroicons_outline:support',
                link : '/ui/helpers'
            },
            {
                id      : 'user-interface.icons',
                title   : 'Icons',
                type    : 'collapsable',
                icon    : 'heroicons_outline:lightning-bolt',
                children: [
                    {
                        id   : 'user-interface.icons.dripicons',
                        title: 'Dripicons',
                        type : 'basic',
                        link : '/ui/icons/dripicons'
                    },
                    {
                        id   : 'user-interface.icons.feather',
                        title: 'Feather',
                        type : 'basic',
                        link : '/ui/icons/feather'
                    },
                    {
                        id   : 'user-interface.icons.heroicons-outline',
                        title: 'Heroicons Outline',
                        type : 'basic',
                        link : '/ui/icons/heroicons-outline'
                    },
                    {
                        id   : 'user-interface.icons.heroicons-solid',
                        title: 'Heroicons Solid',
                        type : 'basic',
                        link : '/ui/icons/heroicons-solid'
                    },
                    {
                        id   : 'user-interface.icons.iconsmind',
                        title: 'Iconsmind',
                        type : 'basic',
                        link : '/ui/icons/iconsmind'
                    },
                    {
                        id   : 'user-interface.icons.material-outline',
                        title: 'Material Outline',
                        type : 'basic',
                        link : '/ui/icons/material-outline'
                    },
                    {
                        id   : 'user-interface.icons.material-twotone',
                        title: 'Material Twotone',
                        type : 'basic',
                        link : '/ui/icons/material-twotone'
                    }
                ]
            },
            {
                id   : 'user-interface.typography',
                title: 'Typography',
                type : 'basic',
                icon : 'heroicons_outline:pencil',
                link : '/ui/typography'
            }
        ]
    },
    {
        id  : 'divider-1',
        type: 'divider'
    },
    {
        id      : 'documentation',
        title   : 'Documentation',
        subtitle: 'Everything you need to know about Treo',
        type    : 'group',
        icon    : 'heroicons_outline:support',
        children: [
            {
                id   : 'documentation.changelog',
                title: 'Changelog',
                type : 'basic',
                icon : 'heroicons_outline:speakerphone',
                link : '/docs/changelog',
                badge: {
                    title     : '1.1.1',
                    style     : 'rounded',
                    background: '#FFEB3B',
                    color     : '#000000'
                }
            },
            {
                id   : 'documentation.guides',
                title: 'Guides',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/guides'
            },
            {
                id   : 'documentation.core-features',
                title: 'Core features',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/core-features'
            },
            {
                id   : 'documentation.other-components',
                title: 'Other components',
                type : 'basic',
                icon : 'heroicons_outline:book-open',
                link : '/docs/other-components'
            }
        ]
    },
    {
        id  : 'divider-2',
        type: 'divider'
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation features',
        subtitle: 'Collapsable levels & badge styles',
        type    : 'group',
        icon    : 'heroicons_outline:menu',
        children: [
            {
                id      : 'navigation-features.level.0',
                title   : 'Level 0',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id      : 'navigation-features.level.0.1',
                        title   : 'Level 1',
                        type    : 'collapsable',
                        children: [
                            {
                                id      : 'navigation-features.level.0.1.2',
                                title   : 'Level 2',
                                type    : 'collapsable',
                                children: [
                                    {
                                        id      : 'navigation-features.level.0.1.2.3',
                                        title   : 'Level 3',
                                        type    : 'collapsable',
                                        children: [
                                            {
                                                id      : 'navigation-features.level.0.1.2.3.4',
                                                title   : 'Level 4',
                                                type    : 'collapsable',
                                                children: [
                                                    {
                                                        id      : 'navigation-features.level.0.1.2.3.4.5',
                                                        title   : 'Level 5',
                                                        type    : 'collapsable',
                                                        children: [
                                                            {
                                                                id   : 'navigation-features.level.0.1.2.3.4.5.6',
                                                                title: 'Level 6',
                                                                type : 'basic'
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                id      : 'navigation-features.level.0',
                title   : 'Level 0',
                subtitle: 'With subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                children: [
                    {
                        id   : 'navigation-features.level.0.1-1',
                        title: 'Level 1.1',
                        type : 'basic'
                    },
                    {
                        id   : 'navigation-features.level.0.1-2',
                        title: 'Level 1.2',
                        type : 'basic'
                    }
                ]
            },
            {
                id      : 'navigation-features.active',
                title   : 'Active item',
                subtitle: 'Manually marked as active',
                icon    : 'heroicons_outline:check-circle',
                type    : 'basic',
                active  : true
            },
            {
                id      : 'navigation-features.disabled-collapsable',
                title   : 'Disabled collapsable',
                subtitle: 'Some subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'collapsable',
                disabled: true,
                children: [
                    {
                        id   : 'navigation-features.disabled-collapsable.child',
                        title: 'You shouldn\'t be able to see this child',
                        type : 'basic'
                    }
                ]
            },
            {
                id      : 'navigation-features.disabled-basic',
                title   : 'Disabled basic',
                subtitle: 'Some subtitle',
                icon    : 'heroicons_outline:check-circle',
                type    : 'basic',
                disabled: true
            },
            {
                id   : 'navigation-features.badge-style-oval',
                title: 'Oval badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title     : '8',
                    background: '#17FEFF',
                    color     : '#000000'
                }
            },
            {
                id   : 'navigation-features.badge-style-rectangle',
                title: 'Rectangle badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title     : 'Updated!',
                    style     : 'rectangle',
                    background: '#17FEFF',
                    color     : '#000000'
                }
            },
            {
                id   : 'navigation-features.badge-style-rounded',
                title: 'Rounded badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title     : 'NEW',
                    style     : 'rounded',
                    background: '#17FEFF',
                    color     : '#000000'
                }
            },
            {
                id   : 'navigation-features.badge-style-simple',
                title: 'Simple badge',
                icon : 'heroicons_outline:tag',
                type : 'basic',
                badge: {
                    title: '87 Unread',
                    style: 'simple',
                    color: '#17FEFF'
                }
            },
            {
                id   : 'navigation-features.multi-line',
                title: 'A multi line navigation item title example which works just fine',
                icon : 'heroicons_outline:check-circle',
                type : 'basic'
            }
        ]
    }
];
export const compactNavigation: TreoNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'aside',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'applications',
        title   : 'Apps',
        type    : 'aside',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const futuristicNavigation: TreoNavigationItem[] = [
    {
        id      : 'apps',
        title   : 'APPS',
        type    : 'group',
        children: [
            {
                id   : 'applications.dashboards.finance',
                title: 'Finance',
                type : 'basic',
                icon : 'heroicons_outline:cash',
                link : '/dashboards/finance'
            },
            {
                id   : 'applications.dashboards.analytics',
                title: 'Analytics',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/dashboards/analytics'
            },
            {
                id   : 'applications.dashboards.crypto',
                title: 'Crypto',
                type : 'basic',
                icon : 'heroicons_outline:currency-dollar',
                link : '/dashboards/crypto'
            },
            {
                id   : 'applications.calendar',
                title: 'Calendar',
                type : 'basic',
                icon : 'heroicons_outline:calendar',
                link : '/apps/calendar'
            },
            {
                id   : 'applications.contacts',
                title: 'Contacts',
                type : 'basic',
                icon : 'heroicons_outline:user-group',
                link : '/apps/contacts'
            },
            {
                id      : 'applications.ecommerce',
                title   : 'ECommerce',
                type    : 'collapsable',
                icon    : 'heroicons_outline:shopping-cart',
                children: [
                    {
                        id   : 'applications.ecommerce.inventory',
                        title: 'Inventory',
                        type : 'basic',
                        link : '/apps/ecommerce/inventory'
                    }
                ]
            },
            {
                id   : 'applications.mailbox',
                title: 'Mailbox',
                type : 'basic',
                icon : 'heroicons_outline:mail',
                link : '/apps/mailbox',
                badge: {
                    title     : '27',
                    style     : 'rounded',
                    background: 'rgba(0, 0, 0, 0.24)',
                    color     : '#FFFFFF'
                }
            },
            {
                id   : 'applications.tasks',
                title: 'Tasks',
                type : 'basic',
                icon : 'heroicons_outline:check-circle',
                link : '/apps/tasks'
            }
        ]
    },
    {
        id   : 'others',
        title: 'OTHERS',
        type : 'group'
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'aside',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'User Interface',
        type    : 'aside',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Navigation Features',
        type    : 'aside',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
export const horizontalNavigation: TreoNavigationItem[] = [
    {
        id      : 'dashboards',
        title   : 'Dashboards',
        type    : 'group',
        icon    : 'heroicons_outline:home',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'applications',
        title   : 'Apps',
        type    : 'group',
        icon    : 'heroicons_outline:qrcode',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'pages',
        title   : 'Pages',
        type    : 'group',
        icon    : 'heroicons_outline:document-duplicate',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'user-interface',
        title   : 'UI',
        type    : 'group',
        icon    : 'heroicons_outline:collection',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id      : 'navigation-features',
        title   : 'Misc',
        type    : 'group',
        icon    : 'heroicons_outline:menu',
        children: [] // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    }
];
