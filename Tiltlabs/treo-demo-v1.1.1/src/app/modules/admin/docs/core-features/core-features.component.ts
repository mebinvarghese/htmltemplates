import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreoNavigationItem } from '@treo/components/navigation';

@Component({
    selector       : 'core-features',
    templateUrl    : './core-features.component.html',
    styleUrls      : ['./core-features.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoreFeaturesComponent
{
    menuData: TreoNavigationItem[];

    /**
     * Constructor
     */
    constructor()
    {
        this.menuData = [
            {
                id      : 'core-features.libraries',
                title   : 'Libraries',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.libraries.mock-api',
                        title: 'MockAPI',
                        type : 'basic',
                        link : '/docs/core-features/libraries/mock-api'
                    }
                ]
            },
            {
                id      : 'core-features.components',
                title   : 'Components',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.components.card',
                        title: 'Card',
                        type : 'basic',
                        link : '/docs/core-features/components/card'
                    },
                    {
                        id   : 'core-features.components.date-range',
                        title: 'DateRange',
                        type : 'basic',
                        link : '/docs/core-features/components/date-range'
                    },
                    {
                        id   : 'core-features.components.drawer',
                        title: 'Drawer',
                        type : 'basic',
                        link : '/docs/core-features/components/drawer'
                    },
                    {
                        id   : 'core-features.components.highlight',
                        title: 'Highlight',
                        type : 'basic',
                        link : '/docs/core-features/components/highlight'
                    },
                    {
                        id   : 'core-features.components.message',
                        title: 'Message',
                        type : 'basic',
                        link : '/docs/core-features/components/message'
                    },
                    {
                        id   : 'core-features.components.navigation',
                        title: 'Navigation',
                        type : 'basic',
                        link : '/docs/core-features/components/navigation'
                    }
                ]
            },
            {
                id      : 'core-features.directives',
                title   : 'Directives',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.directives.autogrow',
                        title: 'Autogrow',
                        type : 'basic',
                        link : '/docs/core-features/directives/autogrow'
                    },
                    {
                        id   : 'core-features.directives.scrollbar',
                        title: 'Scrollbar',
                        type : 'basic',
                        link : '/docs/core-features/directives/scrollbar'
                    },
                    {
                        id   : 'core-features.directives.scroll-reset',
                        title: 'ScrollReset',
                        type : 'basic',
                        link : '/docs/core-features/directives/scroll-reset'
                    }
                ]
            },
            {
                id      : 'core-features.services',
                title   : 'Services',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.services.config',
                        title: 'Config',
                        type : 'basic',
                        link : '/docs/core-features/services/config'
                    },
                    {
                        id   : 'core-features.services.splash-screen',
                        title: 'SplashScreen',
                        type : 'basic',
                        link : '/docs/core-features/services/splash-screen'
                    },
                    {
                        id   : 'core-features.services.media-watcher',
                        title: 'MediaWatcher',
                        type : 'basic',
                        link : '/docs/core-features/services/media-watcher'
                    }
                ]
            },
            {
                id      : 'core-features.pipes',
                title   : 'Pipes',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.pipes.find-by-key',
                        title: 'FindByKey',
                        type : 'basic',
                        link : '/docs/core-features/pipes/find-by-key'
                    }
                ]
            },
            {
                id      : 'core-features.validators',
                title   : 'Validators',
                type    : 'group',
                children: [
                    {
                        id   : 'core-features.validators.must-match',
                        title: 'MustMatch',
                        type : 'basic',
                        link : '/docs/core-features/validators/must-match'
                    }
                ]
            }
        ];
    }
}
