const Client = require("../model/Client");
const CoinTransaction = require("../model/CoinTransaction");


exports.addCoinsToClient = async ({ clientId, coins, type, description = '', challengeId = null, referredUserId = null }) => {
    await Client.findByIdAndUpdate(clientId, { $inc: { earnedCoins: coins } });

    await CoinTransaction.create({
        clientId,
        coins,
        type,
        description,
        challengeId,
        referredUserId
    });
};
