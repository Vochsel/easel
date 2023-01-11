import Cookies from "js-cookie";
import { loadFile } from "../loaders";
import { postEaselAPI } from "./api";

const getFollowers = async (path) => {
    let followers_list = [];

    return new Promise(async resolve => {
        const fo = await loadFile(path + "/.easel/followers.txt");
        followers_list = fo.content.split('\n').filter(n => n);
        resolve(followers_list);
    });
};

const getFollowing = (path) => {
    let following_list = [];

    return new Promise(async resolve => {
        const fo = await loadFile(path + "/.easel/following.txt");
        following_list = fo.content.split('\n').filter(n => n);
        resolve(following_list);
    });
}

const currentEaselProfile = window.location.href + "easel.json";

const followUser = (userToFollow) => {
    let easelUser = Cookies.get('easel-user');
    if (easelUser) {
        console.log(`${easelUser} wants to follow ${userToFollow}`);
        let formData = new FormData();
        formData.append('add_follower', easelUser);
        postEaselAPI(formData).then(x => console.log(x));
    }
}

export { getFollowers, getFollowing, followUser, currentEaselProfile };