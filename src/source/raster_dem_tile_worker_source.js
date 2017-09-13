const WorkerTile = require('./worker_tile');
const {DEMData} = require('../data/dem_data');


/**
 * The {@link WorkerSource} implementation that supports {@link RasterDEMTileSource}.
 *
 * @private
 */

class RasterDEMTileWorkerSource {

    constructor(actor, layerIndex) {
        this.actor = actor;
        this.layerIndex = layerIndex;
        this.loading = {};
        this.loaded = {};
    }

    /**
     * Implements {@link WorkerSource#loadTile}.
     */
    loadTile(params, callback) {
        const source = params.source,
            uid = params.uid;

        if (!this.loading[source])
            this.loading[source] = {};

        const dem = new DEMData(uid);
        this.loading[source][uid] = dem;
        dem.loadFromImage(params.rawImageData);
        const transferrables = [];

        this.loaded[source] = this.loaded[source] || {};
        this.loaded[source][uid] = dem;
        callback(null, dem.serialize(transferrables), transferrables);
    }

    /**
     * Implements {@link WorkerSource#removeTile}.
     *
     * @param params
     * @param params.source The id of the source for which we're loading this tile.
     * @param params.uid The UID for this tile.
     */
    removeTile(params) {
        const loaded = this.loaded[params.source],
            uid = params.uid;
        if (loaded && loaded[uid]) {
            delete loaded[uid];
        }
    }
}

module.exports = RasterDEMTileWorkerSource;
