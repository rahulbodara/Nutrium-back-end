const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending'
    },
    respondedAt: Date,
    progress: {
        total: {
            type: Number,
            default: 0
        },
        entries: [{
            date: String,
            value: Number
        }]
    },
    earnedCoins: {
        type: Number,
        default: 0
    },
    completedAt: {
        type: Date
    },
    feedback: {
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        comment: String,
        submittedAt: Date
    }
}, { _id: false });

const challengeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'challenge_master',
        required: true
    },
    rewardRange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'challenge_master',
        required: true
    },
    description: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    targetValue: {
        type: Number,
        required: true
    },
    coinReward: {
        type: Number,
        required: true
    },
    participationLimit: Number,
    privacy: {
        type: String,
        enum: ['public', 'private'],
        required: true
    },
    selectedClients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients'
    }],
    participants: [participantSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clients',
        required: true
    },
    category: {
        type: String,
        enum: ['fitness', 'nutrition', 'wellness', 'lifestyle', 'other'],
        required: true
    },
    tags: [{
        type: String
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        required: true
    },
    analytics: {
        totalParticipants: {
            type: Number,
            default: 0
        },
        activeParticipants: {
            type: Number,
            default: 0
        },
        completionRate: {
            type: Number,
            default: 0
        },
        averageProgress: {
            type: Number,
            default: 0
        },
        averageRating: {
            type: Number,
            default: 0
        },
        totalFeedback: {
            type: Number,
            default: 0
        }
    },
    isTemplate: {
        type: Boolean,
        default: false
    },
    templateSettings: {
        isReusable: {
            type: Boolean,
            default: false
        },
        maxReuses: {
            type: Number,
            default: 0
        },
        currentReuses: {
            type: Number,
            default: 0
        }
    },
    status: {
        type: String,
        enum: ['draft', 'active', 'completed', 'cancelled'],
        default: 'draft'
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

challengeSchema.virtual('daysRemaining').get(function () {
    const now = new Date();
    const end = new Date(this.endDate);
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

challengeSchema.virtual('daysElapsed').get(function () {
    const now = new Date();
    const start = new Date(this.startDate);
    const diffTime = now - start;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

challengeSchema.methods.updateAnalytics = async function () {
    const totalParticipants = this.participants.length;
    const activeParticipants = this.participants.filter(p => p.status === 'accepted').length;
    const completedParticipants = this.participants.filter(p => p.completedAt).length;

    this.analytics = {
        totalParticipants,
        activeParticipants,
        completionRate: totalParticipants > 0 ? (completedParticipants / totalParticipants) * 100 : 0,
        averageProgress: this.participants.reduce((acc, p) => acc + (p.progress?.total || 0), 0) / totalParticipants || 0,
        averageRating: this.participants.reduce((acc, p) => acc + (p.feedback?.rating || 0), 0) /
            this.participants.filter(p => p.feedback?.rating).length || 0,
        totalFeedback: this.participants.filter(p => p.feedback?.rating).length
    };

    return this.save();
};

module.exports = mongoose.model('challenge', challengeSchema);
