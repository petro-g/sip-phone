import * as React from 'react'
import { connect } from 'react-redux'
import SIPAccount from '../lib/SipAccount'
import styles from './Dialstring.scss'
import callIcon from '../assets/call-24px.svg'
import callIconLarge from '../assets/call-large-40px.svg'

import { PhoneConfig, SipConfig } from '../models'
import { sessionsLimitReached } from '../actions/config'
interface Props {
  sipAccount: SIPAccount
  phoneConfig: PhoneConfig
  sipConfig: SipConfig
  sessions: Object
  started: Boolean
  sessionsLimitReached: Function
  attendedTransfersList: Array<string>
}

class Dialstring extends React.Component<Props> {
  state = {
    currentDialString: ''
  }
  handleDial() {
    let sessionsActive: number = Object.keys(this.props.sessions).length
    let attendedTransferActive: number = this.props.attendedTransfersList.length
    let sessionDiff: number = sessionsActive - attendedTransferActive

    //sessionsLimit check
    if (sessionDiff >= this.props.phoneConfig.sessionsLimit) {
      this.props.sessionsLimitReached()
    } else {
      //strict-mode check
      if (this.props.phoneConfig.mode === 'strict') {
        this.props.sipAccount.makeCall(this.props.phoneConfig.defaultDial)
      }
      //dialstring check
      if (!this.checkDialstring()) {
        this.props.sipAccount.makeCall(`${this.state.currentDialString}`)
      }
    }
  }

  checkDialstring() {
    return this.state.currentDialString.length === 0
  }

  render() {
    const { props } = this
    if (props.phoneConfig.mode.includes('strict') && props.started === true) {
      return (
        <div className={styles.dialstringContainerStrict}>
          <button
            className={styles.dialButtonStrict}
            onClick={() => this.handleDial()}
          >
            <img src={callIconLarge} />
          </button>
        </div>
      )
    } else if (props.phoneConfig.mode.includes('strict')) {
      return null
    } else {
      return (
        <div className={styles.dialstringContainer}>
          <input
            className={styles.dialInput}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                this.handleDial()
                e.preventDefault()
              }
            }}
            placeholder='Enter the number to dial...'
            onChange={(e) =>
              this.setState({ currentDialString: e.target.value })
            }
          />
          <button
            className={styles.dialButton}
            disabled={this.checkDialstring()}
            onClick={() => this.handleDial()}
          >
            <img src={callIcon} />
          </button>
        </div>
      )
    }
  }
}

const mapStateToProps = (state: any) => ({
  sipAccount: state.sipAccounts.sipAccount,
  sessions: state.sipSessions.sessions,
  started: state.config.phoneConfig.started,
  attendedTransfersList: state.sipSessions.attendedTransfers
})

const actions = {
  sessionsLimitReached
}

const D = connect(mapStateToProps, actions)(Dialstring)
export default D
