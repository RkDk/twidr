import Constants from './constants';
import moment from 'moment';

class Utils {
    static axiosOptions( path, options ) {
        return {
            url: `http://localhost:8080${path}`,
            ...options
        };
    }
    static formatDateTime (timestamp) {
        const now = moment().local();
        const date = moment.utc(timestamp).local();
        const diff = +moment.duration(moment(now).startOf('day').diff(moment(date).startOf('day'))).asDays();    
        const timeStr = date.format('LT');
        let dateStr = '';

        if (diff === 0) {
            dateStr = 'Today';
        } else if (diff === 1) {
            dateStr = 'Yesterday';
        } else {
            const sameYear = date.isSame(now, 'year');
            const dateFormat = `MMM D ${sameYear ? '' : 'YYYY'}`;
            dateStr = date.format(dateFormat);
        }
        return `${dateStr} ${timeStr}`;
    }
    static getElementTop(el) {
        let top = 0;
        while(el) {
            top += el.offsetTop;
            el = el.offsetParent;
        }
        return top;
    }
    static getViewportHeight() {
        return document.documentElement.clientHeight;
    }
    static getDocumentScrollPercentage() {
        return ( window.pageYOffset + document.documentElement.clientHeight ) / document.documentElement.scrollHeight;
    }
}

export default Utils;