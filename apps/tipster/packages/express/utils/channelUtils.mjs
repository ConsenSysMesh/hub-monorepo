export const channelUrlToId = (url) => {
    const temp = url.split('/');
    return temp[temp.length - 1];
}

export const isChannelLead = (fid, channel) => {
    return channel.channel.lead.fid === fid;
}