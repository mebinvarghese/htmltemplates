import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreoNavigationItem } from '@treo/components/navigation';

@Component({
    selector       : 'guides',
    templateUrl    : './guides.component.html',
    styleUrls      : ['./guides.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuidesComponent
{
    menuData: TreoNavigationItem[];

    /**
     * Constructor
     */
    constructor()
    {
        this.menuData = [
            {
                id      : 'getting-started',
                title   : 'Getting started',
                type    : 'group',
                children: [
                    {
                        id   : 'getting-started.introduction',
                        title: 'Introduction',
                        type : 'basic',
                        link : '/docs/guides/getting-started/introduction'
                    },
                    {
                        id   : 'getting-started.prerequisites',
                        title: 'Prerequisites',
                        type : 'basic',
                        link : '/docs/guides/getting-started/prerequisites'
                    },
                    {
                        id   : 'getting-started.installation',
                        title: 'Installation',
                        type : 'basic',
                        link : '/docs/guides/getting-started/installation'
                    },
                    {
                        id   : 'getting-started.serving',
                        title: 'Serving',
                        type : 'basic',
                        link : '/docs/guides/getting-started/serving'
                    }
                ]
            },
            {
                id      : 'development',
                title   : 'Development',
                type    : 'group',
                children: [
                    {
                        id   : 'development.directory-structure',
                        title: 'Directory structure',
                        type : 'basic',
                        link : '/docs/guides/development/directory-structure'
                    },
                    {
                        id   : 'development.component-structure',
                        title: 'Component structure',
                        type : 'basic',
                        link : '/docs/guides/development/component-structure'
                    },
                    {
                        id   : 'development.starter-kit',
                        title: 'Starter kit',
                        type : 'basic',
                        link : '/docs/guides/development/starter-kit'
                    },
                    {
                        id   : 'development.deployment',
                        title: 'Deployment',
                        type : 'basic',
                        link : '/docs/guides/development/deployment'
                    },
                    {
                        id   : 'development.updating',
                        title: 'Updating',
                        type : 'basic',
                        link : '/docs/guides/development/updating'
                    }
                ]
            },
            {
                id      : 'customization',
                title   : 'Customization',
                type    : 'group',
                children: [
                    {
                        id   : 'customization.theme-layouts',
                        title: 'Theme layouts',
                        type : 'basic',
                        link : '/docs/guides/customization/theme-layouts'
                    },
                    {
                        id   : 'customization.content-layouts',
                        title: 'Content layouts',
                        type : 'basic',
                        link : '/docs/guides/customization/content-layouts'
                    },
                    {
                        id   : 'customization.tailwindcss',
                        title: 'TailwindCSS',
                        type : 'basic',
                        link : '/docs/guides/customization/tailwindcss'
                    },
                    {
                        id   : 'customization.theming',
                        title: 'Theming',
                        type : 'basic',
                        link : '/docs/guides/customization/theming'
                    },
                    {
                        id   : 'customization.splash-screen',
                        title: 'Splash screen',
                        type : 'basic',
                        link : '/docs/guides/customization/splash-screen'
                    }
                ]
            },
            {
                id      : 'authentication',
                title   : 'Authentication',
                type    : 'group',
                children: [
                    {
                        id   : 'authentication.jwt',
                        title: 'JWT',
                        type : 'basic',
                        link : '/docs/guides/authentication/jwt'
                    }
                ]
            }
        ];
    }
}
