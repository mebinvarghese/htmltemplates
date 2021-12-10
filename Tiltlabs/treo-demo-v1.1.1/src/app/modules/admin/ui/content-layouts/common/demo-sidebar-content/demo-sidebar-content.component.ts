import { Component, ViewEncapsulation } from '@angular/core';
import { TreoNavigationItem } from '@treo/components/navigation/navigation.types';

@Component({
    selector     : 'demo-sidebar-content',
    templateUrl  : './demo-sidebar-content.component.html',
    styleUrls    : ['./demo-sidebar-content.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DemoSidebarContentComponent
{
    menuData: TreoNavigationItem[];

    /**
     * Constructor
     */
    constructor()
    {
        // Set the defaults
        this.menuData = [
            {
                title   : 'Actions',
                subtitle: 'Task, project & team',
                type    : 'group',
                children: [
                    {
                        title: 'Create task',
                        type : 'basic',
                        icon : 'add_circle'
                    },
                    {
                        title: 'Create team',
                        type : 'basic',
                        icon : 'people_alt'
                    },
                    {
                        title: 'Create project',
                        type : 'basic',
                        icon : 'work'
                    },
                    {
                        title: 'Create user',
                        type : 'basic',
                        icon : 'person_outline'
                    },
                    {
                        title   : 'Assign user or team',
                        subtitle: 'Assign to a task or a project',
                        type    : 'basic',
                        icon    : 'assignment_ind'
                    }
                ]
            },
            {
                title   : 'Tasks',
                type    : 'group',
                children: [

                    {
                        title: 'All tasks',
                        type : 'basic',
                        icon : 'list_alt',
                        badge: {
                            title: '49',
                            style: 'rounded'
                        }
                    },
                    {
                        title: 'Ongoing tasks',
                        type : 'basic',
                        icon : 'play_circle_filled'
                    },
                    {
                        title: 'Completed tasks',
                        type : 'basic',
                        icon : 'check_circle'
                    },
                    {
                        title: 'Abandoned tasks',
                        type : 'basic',
                        icon : 'remove_circle'
                    },
                    {
                        title: 'Assigned to me',
                        type : 'basic',
                        icon : 'person_outline'
                    },
                    {
                        title: 'Assigned to my team',
                        type : 'basic',
                        icon : 'people_alt'
                    }
                ]
            },
            {
                title   : 'Settings',
                type    : 'group',
                children: [

                    {
                        title   : 'General',
                        type    : 'collapsable',
                        icon    : 'settings',
                        children: [
                            {
                                title: 'Tasks',
                                type : 'basic'
                            },
                            {
                                title: 'Users',
                                type : 'basic'
                            },
                            {
                                title: 'Teams',
                                type : 'basic'
                            }
                        ]
                    },
                    {
                        title   : 'Account',
                        type    : 'collapsable',
                        icon    : 'account_circle',
                        children: [
                            {
                                title: 'Personal',
                                type : 'basic'
                            },
                            {
                                title: 'Payment',
                                type : 'basic'
                            },
                            {
                                title: 'Security',
                                type : 'basic'
                            }
                        ]
                    }
                ]
            },
            {
                type: 'divider'
            }
        ];
    }
}
