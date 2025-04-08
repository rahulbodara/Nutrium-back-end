const express = require('express');

const router = express.Router()
const { createChallengeMaster, getAllChallengeMasters, getChallengeMasterById, updateChallengeMaster, deleteChallengeMaster, getChallengeMasterKeyValues, getRewardRangesDropdown } = require('../../controller/Master/challenge/StepRewardController');
const { checkPermission } = require('../../middleware/checkPermission');
const { isAuthenticated } = require('../../middleware/auth');

router.post('/', isAuthenticated, checkPermission("create", 'Challenge Master'), createChallengeMaster);
// router.get('/', isAuthenticated, getAllChallengeMasters);
router.get('/:id', isAuthenticated, getChallengeMasterById);
router.put('/:id', isAuthenticated, checkPermission("update", 'Challenge Master'), updateChallengeMaster);
router.delete('/:id', isAuthenticated, checkPermission("delete", 'Challenge Master'), deleteChallengeMaster);
router.get('/', getChallengeMasterKeyValues)
router.get('/reward-ranges-dropdown/:id', getRewardRangesDropdown);


module.exports = router;
