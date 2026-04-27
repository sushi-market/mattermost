// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import React from 'react';
import {FormattedMessage, useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import styled from 'styled-components';

import {DownloadOutlineIcon} from '@mattermost/compass-icons/components';
import type {ProductIdentifier} from '@mattermost/types/products';

import {isCurrentUserGuestUser} from 'mattermost-redux/selectors/entities/users';

import {OnboardingTourSteps, OnboardingTourStepsForGuestUsers} from 'components/tours';
import {
    CustomizeYourExperienceTour,
    useShowOnboardingTutorialStep,
} from 'components/tours/onboarding_tour';
import UserAccountMenu from 'components/user_account_menu';
import WithTooltip from 'components/with_tooltip';

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
    &&& {
        color: rgba(255, 255, 255, 0.88) !important;
    }

    display: inline-flex;
    height: 20px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    gap: 5px;
    padding: 2px 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: var(--radius-s);
    background: rgba(255, 255, 255, 0.07);
    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    font-weight: 600;
    line-height: 16px;
    text-decoration: none;
    white-space: nowrap;
    transition: background-color 150ms ease, border-color 150ms ease, color 150ms ease;

    &:visited {
        color: rgba(255, 255, 255, 0.88) !important;
    }

    &:hover,
    &:focus,
    &:active {
        border-color: rgba(255, 255, 255, 0.14);
        background: rgba(255, 255, 255, 0.15);
        color: #fff !important;
        text-decoration: none;
    }

    &:active {
        background: rgba(255, 255, 255, 0.18);
    }

    &:focus-visible {
        outline: none;
        box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.32),
            inset 0 0 0 2px var(--sidebar-header-bg);
    }

    @media screen and (max-width: 1024px) {
        width: 28px;
        padding: 0;
    }
`;

const DownloadAppButtonIcon = styled.span`
    display: inline-flex;
    width: 14px;
    height: 14px;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    color: inherit;

    svg {
        display: block;
    }
`;

const DownloadAppButtonText = styled.span`
    color: inherit !important;

    @media screen and (max-width: 1024px) {
        display: none;
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
    const downloadAppLabel = formatMessage({id: 'custom.global_header.downloadApp', defaultMessage: 'Скачать приложение'});

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
                    <WithTooltip
                        title={downloadAppLabel}
                    >
                        <DownloadAppButton
                            href={DOWNLOAD_APP_URL}
                            target='_blank'
                            rel='noopener noreferrer'
                            aria-label={downloadAppLabel}
                        >
                            <DownloadAppButtonIcon aria-hidden='true'>
                                <DownloadOutlineIcon size={14}/>
                            </DownloadAppButtonIcon>
                            <DownloadAppButtonText>
                                <FormattedMessage
                                    id='custom.global_header.downloadApp'
                                    defaultMessage='Скачать приложение'
                                />
                            </DownloadAppButtonText>
                        </DownloadAppButton>
                    </WithTooltip>
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
