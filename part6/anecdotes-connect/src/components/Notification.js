import { connect } from 'react-redux'

const Notification = (props) => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        display: props.notification ? '' : 'none',
    }
    return (
        <div style={style} display={'none'}>
        {props.notification}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        notification: state.notification[0]
    }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)

export default ConnectedNotification