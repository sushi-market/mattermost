// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import type {ProductIdentifier} from '@mattermost/types/products';

import {isCurrentUserGuestUser} from 'mattermost-redux/selectors/entities/users';

import {OnboardingTourSteps, OnboardingTourStepsForGuestUsers} from 'components/tours';
import {
    CustomizeYourExperienceTour,
    useShowOnboardingTutorialStep,
} from 'components/tours/onboarding_tour';
import UserAccountMenu from 'components/user_account_menu';

import Pluggable from 'plugins/pluggable';
import {isChannels} from 'utils/products';

import type {GlobalState} from 'types/store';

import AtMentionsButton from './at_mentions_button/at_mentions_button';
import PlanUpgradeButton from './plan_upgrade_button';
import SavedPostsButton from './saved_posts_button/saved_posts_button';
import SettingsButton from './settings_button';

const DOWNLOAD_APP_URL = 'https://mattermost.datafood.tech/';

const RightControlsContainer = styled.div`
    display: flex;
    align-items: center;
    height: 40px;
    flex-shrink: 0;
    position: relative;
    flex-basis: 30%;
    justify-content: flex-end;

    > * + * {
        margin-left: 8px;
    }
`;

const DownloadAppButton = styled.a`
    display: inline-flex;
    height: 28px;
    align-items: center;
    justify-content: center;
    padding: 0 10px;
    border: 1px solid rgba(var(--sidebar-header-text-color-rgb), 0.24);
    border-radius: 4px;
    background: rgba(var(--sidebar-header-text-color-rgb), 0.08);
    color: rgba(var(--sidebar-header-text-color-rgb), 0.72);
    font-size: 12px;
    font-weight: 600;
    line-height: 16px;
    text-decoration: none;
    white-space: nowrap;

    &:hover,
    &:focus {
        background: rgba(var(--sidebar-header-text-color-rgb), 0.16);
        color: rgba(var(--sidebar-header-text-color-rgb), 0.96);
        text-decoration: none;
    }

    &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.32),
            inset 0 0 0 2px var(--sidebar-header-bg);
    }
`;

const StyledCustomizeYourExperienceTour = styled.div`
    display: flex;
    align-items: center;
    height: 100%
`;

export type Props = {
    productId?: ProductIdentifier;
}

const RightControls = ({productId = null}: Props): JSX.Element => {
    const {formatMessage} = useIntl();

    // guest validation to see which point the messaging tour tip starts
    const isGuestUser = useSelector((state: GlobalState) => isCurrentUserGuestUser(state));
    const tourStep = isGuestUser ? OnboardingTourStepsForGuestUsers.CUSTOMIZE_EXPERIENCE : OnboardingTourSteps.CUSTOMIZE_EXPERIENCE;

    const showCustomizeTip = useShowOnboardingTutorialStep(tourStep);

    return (
        <RightControlsContainer
            id={'RightControlsContainer'}
        >
            <PlanUpgradeButton/>
            {isChannels(productId) ? (
                <>
                    <DownloadAppButton
                        href={DOWNLOAD_APP_URL}
                        target='_blank'
                        rel='noopener noreferrer'
                        aria-label={formatMessage({id: 'custom.global_header.downloadApp', defaultMessage: 'Скачать приложение'})}
                    >
                        <FormattedMessage
                            id='custom.global_header.downloadApp'
                            defaultMessage='Скачать приложение'
                        />
                    </DownloadAppButton>
                    <AtMentionsButton/>
                    <SavedPostsButton/>
                </>
            ) : (
                <Pluggable
                    pluggableName={'Product'}
                    subComponentName={'headerRightComponent'}
                    pluggableId={productId}
                />
            )}
            <StyledCustomizeYourExperienceTour id='CustomizeYourExperienceTour'>
                {
                    isChannels(productId) ? (
                        <>
                            <SettingsButton/>
                            {showCustomizeTip && <CustomizeYourExperienceTour/>}
                        </>
                    ) : null
                }
                <UserAccountMenu/>
            </StyledCustomizeYourExperienceTour>
        </RightControlsContainer>
    );
};

export default RightControls;
