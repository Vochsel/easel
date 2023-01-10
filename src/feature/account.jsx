import { loadFile } from "../loaders";

const getFollowers = async (path) => {
    let followers_list = [];

    return new Promise(async resolve => {
        const fo = await loadFile(path + "/.easel/followers.txt");
        followers_list = fo.content.split('\n');
        resolve(followers_list);
    });
};

const getFollowing = (path) => {
    let following_list = [];

    return new Promise(async resolve => {
        const fo = await loadFile(path + "/.easel/following.txt");
        following_list = fo.content.split('\n');
        resolve(following_list);
    });
}

export { getFollowers, getFollowing };