// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';

import Menu from 'components/widgets/menu/menu';
import MenuWrapper from 'components/widgets/menu/menu_wrapper';

import {shallowWithIntl} from 'tests/helpers/intl-test-helper';

import UserGuideDropdown from './user_guide_dropdown';

describe('components/channel_header/components/UserGuideDropdown', () => {
    const baseProps = {
        actions: {
            openModal: jest.fn(),
        },
    };

    test('should match snapshot', () => {
        const wrapper = shallowWithIntl(
            <UserGuideDropdown {...baseProps}/>,
        );

        expect(wrapper).toMatchSnapshot();
    });

    test('should only render the local keyboard shortcuts action', () => {
        const wrapper = shallowWithIntl(
            <UserGuideDropdown {...baseProps}/>,
        );

        expect(wrapper.find(Menu.ItemExternalLink).exists()).toBe(false);
        expect(wrapper.find(Menu.ItemAction).find('#keyboardShortcuts').exists()).toBe(true);
    });

    test('Should open keyboard shortcuts modal', () => {
        const wrapper = shallowWithIntl(
            <UserGuideDropdown {...baseProps}/>,
        );

        expect(wrapper.state('buttonActive')).toBe(false);
        wrapper.find(MenuWrapper).prop('onToggle')!(true);
        expect(wrapper.state('buttonActive')).toBe(true);
    });

    test('Should set state buttonActive on toggle of MenuWrapper', () => {
        const wrapper = shallowWithIntl(
            <UserGuideDropdown {...baseProps}/>,
        );

        wrapper.find(Menu.ItemAction).find('#keyboardShortcuts').prop('onClick')!({preventDefault: jest.fn()} as unknown as React.MouseEvent);
        expect(baseProps.actions.openModal).toHaveBeenCalled();
    });
});
