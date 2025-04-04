const { defineAbilityFor } = require("../helper/defineAbility");

function checkPermission(action, subject) {
    return async (req, res, next) => {
        try {
            const user = req.userId;
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const ability = await defineAbilityFor(user);

            if (ability.can(action, subject)) {
                return next();
            }

            return res.status(403).json({ message: 'Forbidden: You do not have permission' });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };
}

module.exports = { checkPermission };
