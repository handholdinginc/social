import PropTypes from 'prop-types';
import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { withRouter } from 'react-router-dom';

import InnerHeader from '../../account/components/header';

import MovedNote from './moved_note';

export default @withRouter
class Header extends ImmutablePureComponent {

  static propTypes = {
    account: ImmutablePropTypes.map,
    identity_proofs: ImmutablePropTypes.list,
    onFollow: PropTypes.func.isRequired,
    onBlock: PropTypes.func.isRequired,
    onMention: PropTypes.func.isRequired,
    onDirect: PropTypes.func.isRequired,
    onChat: PropTypes.func,
    onReblogToggle: PropTypes.func.isRequired,
    onReport: PropTypes.func.isRequired,
    onMute: PropTypes.func.isRequired,
    onBlockDomain: PropTypes.func.isRequired,
    onUnblockDomain: PropTypes.func.isRequired,
    onEndorseToggle: PropTypes.func.isRequired,
    onAddToList: PropTypes.func.isRequired,
    username: PropTypes.string,
    history: PropTypes.object,
  };

  handleFollow = () => {
    this.props.onFollow(this.props.account);
  }

  handleBlock = () => {
    this.props.onBlock(this.props.account);
  }

  handleMention = () => {
    this.props.onMention(this.props.account, this.props.history);
  }

  handleDirect = () => {
    this.props.onDirect(this.props.account, this.props.history);
  }

  handleReport = () => {
    this.props.onReport(this.props.account);
  }

  handleReblogToggle = () => {
    this.props.onReblogToggle(this.props.account);
  }

  handleSubscriptionToggle = () => {
    this.props.onSubscriptionToggle(this.props.account);
  }

  handleNotifyToggle = () => {
    this.props.onNotifyToggle(this.props.account);
  }

  handleMute = () => {
    this.props.onMute(this.props.account);
  }

  handleBlockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1];

    if (!domain) return;

    this.props.onBlockDomain(domain);
  }

  handleUnblockDomain = () => {
    const domain = this.props.account.get('acct').split('@')[1];

    if (!domain) return;

    this.props.onUnblockDomain(domain);
  }

  handleChat = () => {
    this.props.onChat(this.props.account, this.props.history);
  }

  handleEndorseToggle = () => {
    this.props.onEndorseToggle(this.props.account);
  }

  handleAddToList = () => {
    this.props.onAddToList(this.props.account);
  }

  handleDeactivateUser = () => {
    this.props.onDeactivateUser(this.props.account);
  }

  handleDeleteUser = () => {
    this.props.onDeleteUser(this.props.account);
  }

  handleVerifyUser = () => {
    this.props.onVerifyUser(this.props.account);
  }

  handleUnverifyUser = () => {
    this.props.onUnverifyUser(this.props.account);
  }

  handlePromoteToAdmin = () => {
    this.props.onPromoteToAdmin(this.props.account);
  }

  handlePromoteToModerator = () => {
    this.props.onPromoteToModerator(this.props.account);
  }

  handleDemoteToUser = () => {
    this.props.onDemoteToUser(this.props.account);
  }

  handleSuggestUser = () => {
    this.props.onSuggestUser(this.props.account);
  }

  handleUnsuggestUser = () => {
    this.props.onUnsuggestUser(this.props.account);
  }

  handleShowNote = () => {
    this.props.onShowNote(this.props.account);
  }

  render() {
    const { account, identity_proofs } = this.props;
    const moved = (account) ? account.get('moved') : false;

    return (
      <div className='account-timeline__header'>
        { moved && <MovedNote from={account} to={account.get('moved')} /> }

        <InnerHeader
          account={account}
          identity_proofs={identity_proofs}
          onFollow={this.handleFollow}
          onBlock={this.handleBlock}
          onMention={this.handleMention}
          onDirect={this.handleDirect}
          onChat={this.handleChat}
          onReblogToggle={this.handleReblogToggle}
          onSubscriptionToggle={this.handleSubscriptionToggle}
          onNotifyToggle={this.handleNotifyToggle}
          onReport={this.handleReport}
          onMute={this.handleMute}
          onBlockDomain={this.handleBlockDomain}
          onUnblockDomain={this.handleUnblockDomain}
          onEndorseToggle={this.handleEndorseToggle}
          onAddToList={this.handleAddToList}
          onDeactivateUser={this.handleDeactivateUser}
          onDeleteUser={this.handleDeleteUser}
          onVerifyUser={this.handleVerifyUser}
          onUnverifyUser={this.handleUnverifyUser}
          onPromoteToAdmin={this.handlePromoteToAdmin}
          onPromoteToModerator={this.handlePromoteToModerator}
          onDemoteToUser={this.handleDemoteToUser}
          onSuggestUser={this.handleSuggestUser}
          onUnsuggestUser={this.handleUnsuggestUser}
          onShowNote={this.handleShowNote}
          username={this.props.username}
        />
      </div>
    );
  }

}
