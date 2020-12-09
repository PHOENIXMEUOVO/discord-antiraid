module.exports = class {
    constructor(client) {
        this.client = client
    }
    async run (channel) {
        let exempt = false,
            event = "channelDelete",
            check = false,
            startAt = Date.now();
        if (this.client.options.exemptEvent.includes(event)) return undefined
        channel.guild.fetchAuditLogs({type: "CHANNEL_DELETE"}).then(audit => audit.entries.first()).then(async entry => {
            let member = channel.guild.members.cache.get(entry.executor.id)
            let obje = await this.client.search(member, event);
            exempt = await this.client.checkExempt(member)
            if (!exempt) {
                check = await this.client.checkCase(member, event, obje)
                if (check === true) {
                    return this.client.punish(member)
                }
            }
            await this.client.addCase(member, event, obje, startAt)
        })
    }
}