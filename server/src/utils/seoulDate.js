import moment from "moment";
import "moment-timezone";

moment.tz.setDefault("Asia/Seoul");

const date = moment().format("YYYY-MM-DD HH:mm:ss");

export default date;
