import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { TreoNavigationItem } from '@treo/components/navigation';

@Component({
    selector       : 'other-components',
    templateUrl    : './other-components.component.html',
    styleUrls      : ['./other-components.component.scss'],
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OtherComponentsComponent
{
    menuData: TreoNavigationItem[];

    /**
     * Constructor
     */
    constructor()
    {
        this.menuData = [
            {
                id      : 'common',
                title   : 'Common',
                subtitle: 'Custom made high-level components',
                type    : 'group',
                children: [
                    {
                        id   : 'common.overview',
                        title: 'Overview',
                        type : 'basic',
                        link : '/docs/other-components/common/overview'
                    },
                    {
                        id   : 'common.messages',
                        title: 'Messages',
                        type : 'basic',
                        link : '/docs/other-components/common/messages'
                    },
                    {
                        id   : 'common.notifications',
                        title: 'Notifications',
                        type : 'basic',
                        link : '/docs/other-components/common/notifications'
                    },
                    {
                        id   : 'common.search',
                        title: 'Search',
                        type : 'basic',
                        link : '/docs/other-components/common/search'
                    },
                    {
                        id   : 'common.shortcuts',
                        title: 'Shortcuts',
                        type : 'basic',
                        link : '/docs/other-components/common/shortcuts'
                    },
                    {
                        id   : 'common.user',
                        title: 'User',
                        type : 'basic',
                        link : '/docs/other-components/common/user'
                    }
                ]
            },
            {
                id  : 'divider-1',
                type: 'divider'
            },
            {
                id      : 'third-party',
                title   : 'Third party',
                subtitle: 'Supported components',
                type    : 'group',
                children: [
                    {
                        id   : 'third-party.apex-charts',
                        title: 'ApexCharts',
                        type : 'basic',
                        link : '/docs/other-components/third-party/apex-charts'
                    },
                    {
                        id   : 'third-party.full-calendar',
                        title: 'FullCalendar',
                        type : 'basic',
                        link : '/docs/other-components/third-party/full-calendar'
                    },
                    {
                        id   : 'third-party.ngx-markdown',
                        title: 'ngx-markdown',
                        type : 'basic',
                        link : '/docs/other-components/third-party/ngx-markdown'
                    },
                    {
                        id   : 'third-party.quill-editor',
                        title: 'Quill editor',
                        type : 'basic',
                        link : '/docs/other-components/third-party/quill-editor'
                    }
                ]
            }
        ];
    }
}
