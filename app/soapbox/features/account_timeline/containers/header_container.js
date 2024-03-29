import { List as ImmutableList } from 'immutable';
import React from 'react';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { initAccountNoteModal } from 'soapbox/actions/account_notes';
import {
  followAccount,
  unfollowAccount,
  blockAccount,
  unblockAccount,
  unmuteAccount,
  pinAccount,
  unpinAccount,
  subscribeAccount,
  unsubscribeAccount,
} from 'soapbox/actions/accounts';
import {
  verifyUser,
  unverifyUser,
  promoteToAdmin,
  promoteToModerator,
  demoteToUser,
  suggestUsers,
  unsuggestUsers,
} from 'soapbox/actions/admin';
import { launchChat } from 'soapbox/actions/chats';
import {
  mentionCompose,
  directCompose,
} from 'soapbox/actions/compose';
import { blockDomain, unblockDomain } from 'soapbox/actions/domain_blocks';
import { openModal } from 'soapbox/actions/modals';
import { deactivateUserModal, deleteUserModal } from 'soapbox/actions/moderation';
import { initMuteModal } from 'soapbox/actions/mutes';
import { initReport } from 'soapbox/actions/reports';
import { getSettings } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import { makeGetAccount } from 'soapbox/selectors';
import { isAdmin } from 'soapbox/utils/accounts';

import Header from '../components/header';

const messages = defineMessages({
  unfollowConfirm: { id: 'confirmations.unfollow.confirm', defaultMessage: 'Unfollow' },
  blockConfirm: { id: 'confirmations.block.confirm', defaultMessage: 'Block' },
  blockDomainConfirm: { id: 'confirmations.domain_block.confirm', defaultMessage: 'Hide entire domain' },
  blockAndReport: { id: 'confirmations.block.block_and_report', defaultMessage: 'Block & Report' },
  userVerified: { id: 'admin.users.user_verified_message', defaultMessage: '@{acct} was verified' },
  userUnverified: { id: 'admin.users.user_unverified_message', defaultMessage: '@{acct} was unverified' },
  promotedToAdmin: { id: 'admin.users.actions.promote_to_admin_message', defaultMessage: '@{acct} was promoted to an admin' },
  promotedToModerator: { id: 'admin.users.actions.promote_to_moderator_message', defaultMessage: '@{acct} was promoted to a moderator' },
  demotedToModerator: { id: 'admin.users.actions.demote_to_moderator_message', defaultMessage: '@{acct} was demoted to a moderator' },
  demotedToUser: { id: 'admin.users.actions.demote_to_user_message', defaultMessage: '@{acct} was demoted to a regular user' },
  userSuggested: { id: 'admin.users.user_suggested_message', defaultMessage: '@{acct} was suggested' },
  userUnsuggested: { id: 'admin.users.user_unsuggested_message', defaultMessage: '@{acct} was unsuggested' },
});

const makeMapStateToProps = () => {
  const getAccount = makeGetAccount();

  const mapStateToProps = (state, { accountId }) => ({
    account: getAccount(state, accountId),
    identity_proofs: state.getIn(['identity_proofs', accountId], ImmutableList()),
  });

  return mapStateToProps;
};

const mapDispatchToProps = (dispatch, { intl }) => ({

  onFollow(account) {
    dispatch((_, getState) => {
      const unfollowModal = getSettings(getState()).get('unfollowModal');
      if (account.getIn(['relationship', 'following']) || account.getIn(['relationship', 'requested'])) {
        if (unfollowModal) {
          dispatch(openModal('CONFIRM', {
            message: <FormattedMessage id='confirmations.unfollow.message' defaultMessage='Are you sure you want to unfollow {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
            confirm: intl.formatMessage(messages.unfollowConfirm),
            onConfirm: () => dispatch(unfollowAccount(account.get('id'))),
          }));
        } else {
          dispatch(unfollowAccount(account.get('id')));
        }
      } else {
        dispatch(followAccount(account.get('id')));
      }
    });
  },

  onBlock(account) {
    if (account.getIn(['relationship', 'blocking'])) {
      dispatch(unblockAccount(account.get('id')));
    } else {
      dispatch(openModal('CONFIRM', {
        icon: require('@tabler/icons/icons/ban.svg'),
        heading: <FormattedMessage id='confirmations.block.heading' defaultMessage='Block @{name}' values={{ name: account.get('acct') }} />,
        message: <FormattedMessage id='confirmations.block.message' defaultMessage='Are you sure you want to block {name}?' values={{ name: <strong>@{account.get('acct')}</strong> }} />,
        confirm: intl.formatMessage(messages.blockConfirm),
        onConfirm: () => dispatch(blockAccount(account.get('id'))),
        secondary: intl.formatMessage(messages.blockAndReport),
        onSecondary: () => {
          dispatch(blockAccount(account.get('id')));
          dispatch(initReport(account));
        },
      }));
    }
  },

  onMention(account, router) {
    dispatch(mentionCompose(account, router));
  },

  onDirect(account, router) {
    dispatch(directCompose(account, router));
  },

  onReblogToggle(account) {
    if (account.getIn(['relationship', 'showing_reblogs'])) {
      dispatch(followAccount(account.get('id'), { reblogs: false }));
    } else {
      dispatch(followAccount(account.get('id'), { reblogs: true }));
    }
  },

  onSubscriptionToggle(account) {
    if (account.getIn(['relationship', 'subscribing'])) {
      dispatch(unsubscribeAccount(account.get('id')));
    } else {
      dispatch(subscribeAccount(account.get('id')));
    }
  },

  onNotifyToggle(account) {
    if (account.getIn(['relationship', 'notifying'])) {
      dispatch(followAccount(account.get('id'), { notify: false }));
    } else {
      dispatch(followAccount(account.get('id'), { notify: true }));
    }
  },

  onEndorseToggle(account) {
    if (account.getIn(['relationship', 'endorsed'])) {
      dispatch(unpinAccount(account.get('id')));
    } else {
      dispatch(pinAccount(account.get('id')));
    }
  },

  onReport(account) {
    dispatch(initReport(account));
  },

  onMute(account) {
    if (account.getIn(['relationship', 'muting'])) {
      dispatch(unmuteAccount(account.get('id')));
    } else {
      dispatch(initMuteModal(account));
    }
  },

  onBlockDomain(domain) {
    dispatch(openModal('CONFIRM', {
      icon: require('@tabler/icons/icons/ban.svg'),
      heading: <FormattedMessage id='confirmations.domain_block.heading' defaultMessage='Block {domain}' values={{ domain }} />,
      message: <FormattedMessage id='confirmations.domain_block.message' defaultMessage='Are you really, really sure you want to block the entire {domain}? In most cases a few targeted blocks or mutes are sufficient and preferable. You will not see content from that domain in any public timelines or your notifications.' values={{ domain: <strong>{domain}</strong> }} />,
      confirm: intl.formatMessage(messages.blockDomainConfirm),
      onConfirm: () => dispatch(blockDomain(domain)),
    }));
  },

  onUnblockDomain(domain) {
    dispatch(unblockDomain(domain));
  },

  onAddToList(account) {
    dispatch(openModal('LIST_ADDER', {
      accountId: account.get('id'),
    }));
  },

  onChat(account, router) {
    dispatch(launchChat(account.get('id'), router));
  },

  onDeactivateUser(account) {
    dispatch(deactivateUserModal(intl, account.get('id')));
  },

  onDeleteUser(account) {
    dispatch(deleteUserModal(intl, account.get('id')));
  },

  onVerifyUser(account) {
    const message = intl.formatMessage(messages.userVerified, { acct: account.get('acct') });

    dispatch(verifyUser(account.get('id')))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onUnverifyUser(account) {
    const message = intl.formatMessage(messages.userUnverified, { acct: account.get('acct') });

    dispatch(unverifyUser(account.get('id')))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onPromoteToAdmin(account) {
    const message = intl.formatMessage(messages.promotedToAdmin, { acct: account.get('acct') });

    dispatch(promoteToAdmin(account.get('id')))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onPromoteToModerator(account) {
    const messageType = isAdmin(account) ? messages.demotedToModerator : messages.promotedToModerator;
    const message = intl.formatMessage(messageType, { acct: account.get('acct') });

    dispatch(promoteToModerator(account.get('id')))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onDemoteToUser(account) {
    const message = intl.formatMessage(messages.demotedToUser, { acct: account.get('acct') });

    dispatch(demoteToUser(account.get('id')))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onSuggestUser(account) {
    const message = intl.formatMessage(messages.userSuggested, { acct: account.get('acct') });

    dispatch(suggestUsers([account.get('id')]))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onUnsuggestUser(account) {
    const message = intl.formatMessage(messages.userUnsuggested, { acct: account.get('acct') });

    dispatch(unsuggestUsers([account.get('id')]))
      .then(() => dispatch(snackbar.success(message)))
      .catch(() => {});
  },

  onShowNote(account) {
    dispatch(initAccountNoteModal(account));
  },
});

export default injectIntl(connect(makeMapStateToProps, mapDispatchToProps)(Header));
