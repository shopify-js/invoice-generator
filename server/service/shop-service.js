const Shop = require('../model/shop-model');

module.exports = {
    async getShop(name) {
        try {
            let shop = await Shop.findOne({ name });
            return shop;
        } catch (err) {
            throw err;
        }
    },

    async isActive(shopName) {
        try {
            let shop = this.getShop(shopName);
            if (shop != null && shop.isActive) {
                return true;
            }
            return false;
        } catch (err) {
            throw err;
        }
    },

    async markActive(shop) {
        let s = this.getShop(shop.name);
        if (s == null)
            s = {};
        s.isActive = true;
        s.scope = shop.scope;
        await s.save();
    },

    async markInactive(shopName) {
        let shop = this.getShop(shopName);
        if (shop == null)
            shop = {};
        shop.isActive = false;
    }
}