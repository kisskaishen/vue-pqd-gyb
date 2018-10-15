import {clearCookie} from "./util";
import router from '../router'

export default () => {
    clearCookie('token')
    router.push('/login');
}
