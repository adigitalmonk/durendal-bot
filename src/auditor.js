const audit_backlog = 10;
const threshold = 3;

class Auditor {
    constructor() {
        this.data = {};
    }

    observe(user, command) {
        let date = new Date();
        let timestamp = date.getHours() + "" + date.getMinutes();

        if (this.data.length > audit_backlog) {
            this.data.pop();
        }

        if (!this.data[timestamp]) {
            this.data[timestamp] = {};
        }

        if (!this.data[timestamp][user]) {
            this.data[timestamp][user] = {};
        }

        if (!this.data[timestamp][user][command]) {
            this.data[timestamp][user][command] = 1;
            return true;
        }

        if (this.data[timestamp][user][command] >= threshold) {
            return false;
        }

        this.data[timestamp][user][command] += 1;
        return true;
    }

    report(user) {
        let date = new Date();
        let timestamp = date.getHours() + "" + date.getMinutes();
        return this.data[timestamp][user];
    }
}

module.exports = new Auditor();
