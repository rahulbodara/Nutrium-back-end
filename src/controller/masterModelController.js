

const fs = require('fs');
const path = require('path');

function toTitleCase(str) {
    return str
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

exports.getMasterModels = (req, res) => {
    const masterDir = path.join(__dirname, '../model/Masters');

    fs.readdir(masterDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading master model files', error: err.message });
        }

        const masterModels = files
            .filter(file => file.endsWith('.js'))
            .map(file => {
                const value = file.replace('.js', '');
                return {
                    label: toTitleCase(value),
                    value
                };
            });

        res.json({ masterModels });
    });
};
