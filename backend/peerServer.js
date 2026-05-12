const { ExpressPeerServer } =
    require("peer");

module.exports = (server) => {

    return ExpressPeerServer(
        server,
        {
            debug: true
        }
    );
};