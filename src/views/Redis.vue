<template>
	<div class="ui grid" style="margin: 20px">
		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<div class="ui message">
				<ul class="list">
					<li>Enter redis url</li>
					<li>Pick attribute in json viewer in the right</li>
					<li>Enter boardname then click create</li>
				</ul>
			</div>
			<form class="ui form">
				<div class="field required">
					<label>Board name</label>
					<input type="text" placeholder="Board name" v-model="boardName" />
				</div>
				<div class="field">
					<label>Redis url</label>
					<input type="text" placeholder="Redis url" v-model="url" />
					<div class="ui pointing label">
						redis://{host}:{port}
					</div>
				</div>
				<div class="field">
					<label>Board type</label>
					<select class="ui fluid dropdown" v-model="boardType">
						<option value="Pie">Pie</option>
						<option value="Line">Line</option>
						<option value="Table">Table</option>
					</select>
				</div>
				<div class="field">
					<label>IntervalTime</label>
					<input type="text" v-model="intervalTime" />
				</div>
				<button class="ui button green" type="button" @click.prevent="submit">Create</button>
			</form>
		</div>

		<div class="eight wide column" style="padding:15px; background:white; border-radius:5px">
			<vue-json-pretty
				v-if="renderOK"
				v-model="value"
				:data="data"
				:deep="deep"
				:show-double-quotes="showDoubleQuotes"
				:highlight-mouseover-node="highlightMouseoverNode"
				:highlight-selected-node="highlightSelectedNode"
				:show-length="showLength"
				:show-line="showLine"
				:select-on-click-node="selectOnClickNode"
				:collapsed-on-click-brackets="collapsedOnClickBrackets"
				:path-selectable="(path, data) => typeof data !== 'object'"
				:selectable-type="selectableType"
				:show-select-controller="showSelectController"
			/>
		</div>
	</div>
</template>

<script>
import VueJsonPretty from "vue-json-pretty";
import "vue-json-pretty/lib/styles.css";

export default {
	name: "Redis",
	components: {
		VueJsonPretty,
	},
	data() {
		return {
			boardType: "Table",
			intervalTime: 5000,
			boardName: "",
			url: "",
			renderOK: true,
			data: data,
			value: [],
			selectableType: "multiple",
			showSelectController: true,
			showLength: false,
			showLine: true,
			showDoubleQuotes: true,
			highlightMouseoverNode: true,
			highlightSelectedNode: true,
			selectOnClickNode: true,
			collapsedOnClickBrackets: true,
			useCustomLinkFormatter: false,
			deep: 1,
			itemData: {},
			itemPath: "",
		};
	},
	methods: {
		submit() {
			if (this.boardName.trim() === "") {
				this.$notify({
					group: "noti",
					title: "Board name can't be empty",
					type: "error",
				});
				return;
			}
			if (this.value.length === 0) {
				this.$notify({
					group: "noti",
					title: "Pick atleast one attribute",
					type: "error",
				});
				return;
			}
			let id = this.$store.getters.getId;
			let board = {
				name: this.boardName,
				w: 6,
				h: 12,
				i: id,
				x: 0,
				y: 0,
				intervalTime: this.intervalTime,
				fields: [],
				data: [],
				type: this.boardType,
			};
			for (let o of this.value) {
				let spl = o.split(".");
				let section = spl[1];
				let attribute = spl[2];
				this.$store.commit("addDatasource", {
					type: "redis",
					datasourceName: this.url + attribute,
					redis: {
						url: this.url,
						section,
						attribute,
					},
					value: 0,
				});
				board.fields.push({
					name: attribute,
					datasourceName: this.url + attribute,
					warning: "",
				});
			}
			this.$store.commit("addBoard", board);
			this.data = "";
			this.$router.push({ name: "Home" });
		},
	},
};
const data = {
	server: {
		redis_version: "Version of the Redis server",
		redis_git_sha1: "Git SHA1",
		redis_git_dirty: "Git dirty flag",
		redis_build_id: "The build id",
		redis_mode: "The server's mode ('standalone', 'sentinel' or 'cluster')",
		os: "Operating system hosting the Redis server",
		arch_bits: "Architecture (32 or 64 bits)",
		multiplexing_api: "Event loop mechanism used by Redis",
		atomicvar_api: "Atomicvar API used by Redis",
		gcc_version: "Version of the GCC compiler used to compile the Redis server",
		process_id: "PID of the server process",
		run_id: "Random value identifying the Redis server (to be used by Sentinel and Cluster)",
		tcp_port: "TCP/IP listen port",
		uptime_in_seconds: "Number of seconds since Redis server start",
		uptime_in_days: "Same value expressed in days",
		hz: "The server's current frequency setting",
		configured_hz: "The server's configured frequency setting",
		lru_clock: "Clock incrementing every minute, for LRU management",
		executable: "The path to the server's executable",
		config_file: "The path to the config file",
	},
	client: {
		connected_clients: "Number of client connections (excluding connections from replicas)",
		cluster_connections: "An approximation of the number of sockets used by the cluster's bus",
		maxclients:
			"The value of the maxclients configuration directive. This is the upper limit for the sum of connected_clients, connected_slaves and cluster_connections.",
		client_longest_output_list: "Longest output list among current client connections",
		client_biggest_input_buf: "Biggest input buffer among current client connections",
		blocked_clients:
			"Number of clients pending on a blocking call (BLPOP, BRPOP, BRPOPLPUSH, BLMOVE, BZPOPMIN, BZPOPMAX)",
		tracking_clients: "Number of clients being tracked (CLIENT TRACKING)",
		clients_in_timeout_table: "Number of clients in the clients timeout table",
		io_threads_active: "Flag indicating if I/O threads are active",
	},
	memory: {
		used_memory:
			"Total number of bytes allocated by Redis using its allocator (either standard libc, jemalloc, or an alternative allocator such as tcmalloc)",
		used_memory_human: "Human readable representation of previous value",
		used_memory_rss:
			"Number of bytes that Redis allocated as seen by the operating system (a.k.a resident set size). This is the number reported by tools such as top(1) and ps(1)",
		used_memory_rss_human: "Human readable representation of previous value",
		used_memory_peak: "Peak memory consumed by Redis (in bytes)",
		used_memory_peak_human: "Human readable representation of previous value",
		used_memory_peak_perc: "The percentage of used_memory_peak out of used_memory",
		used_memory_overhead:
			"The sum in bytes of all overheads that the server allocated for managing its internal data structures",
		used_memory_startup: "Initial amount of memory consumed by Redis at startup in bytes",
		used_memory_dataset:
			"The size in bytes of the dataset (used_memory_overhead subtracted from used_memory)",
		used_memory_dataset_perc:
			"The percentage of used_memory_dataset out of the net memory usage (used_memory minus used_memory_startup)",
		total_system_memory: "The total amount of memory that the Redis host has",
		total_system_memory_human: "Human readable representation of previous value",
		used_memory_lua: "Number of bytes used by the Lua engine",
		used_memory_lua_human: "Human readable representation of previous value",
		used_memory_scripts: "Number of bytes used by cached Lua scripts",
		used_memory_scripts_human: "Human readable representation of previous value",
		maxmemory: "The value of the maxmemory configuration directive",
		maxmemory_human: "Human readable representation of previous value",
		maxmemory_policy: "The value of the maxmemory-policy configuration directive",
		mem_fragmentation_ratio: "Ratio between used_memory_rss and used_memory",
		mem_allocator: "Memory allocator, chosen at compile time",
		active_defrag_running: "Flag indicating if active defragmentation is active",
		lazyfree_pending_objects:
			"The number of objects waiting to be freed (as a result of calling UNLINK, or FLUSHDB and FLUSHALL with the ASYNC option)",
	},
	persistence: {
		loading: "Flag indicating if the load of a dump file is on-going",
		rdb_changes_since_last_save: "Number of changes since the last dump",
		rdb_bgsave_in_progress: "Flag indicating a RDB save is on-going",
		rdb_last_save_time: "Epoch-based timestamp of last successful RDB save",
		rdb_last_bgsave_status: "Status of the last RDB save operation",
		rdb_last_bgsave_time_sec: "Duration of the last RDB save operation in seconds",
		rdb_current_bgsave_time_sec: "Duration of the on-going RDB save operation if any",
		rdb_last_cow_size:
			"The size in bytes of copy-on-write allocations during the last RDB save operation",
		aof_enabled: "Flag indicating AOF logging is activated",
		aof_rewrite_in_progress: "Flag indicating a AOF rewrite operation is on-going",
		aof_rewrite_scheduled:
			"Flag indicating an AOF rewrite operation will be scheduled once the on-going RDB save is complete.",
		aof_last_rewrite_time_sec: "Duration of the last AOF rewrite operation in seconds",
		aof_current_rewrite_time_sec: "Duration of the on-going AOF rewrite operation if any",
		aof_last_bgrewrite_status: "Status of the last AOF rewrite operation",
		aof_last_write_status: "Status of the last write operation to the AOF",
		aof_last_cow_size:
			"The size in bytes of copy-on-write allocations during the last AOF rewrite operation",
		module_fork_in_progress: "Flag indicating a module fork is on-going",
		module_fork_last_cow_size:
			"The size in bytes of copy-on-write allocations during the last module fork operation",
	},
	stats: {
		total_connections_received: "Total number of connections accepted by the server",
		total_commands_processed: "Total number of commands processed by the server",
		instantaneous_ops_per_sec: "Number of commands processed per second",
		total_net_input_bytes: "The total number of bytes read from the network",
		total_net_output_bytes: "The total number of bytes written to the network",
		instantaneous_input_kbps: "The network's read rate per second in KB/sec",
		instantaneous_output_kbps: "The network's write rate per second in KB/sec",
		rejected_connections: "Number of connections rejected because of maxclients limit",
		sync_full: "The number of full resyncs with replicas",
		sync_partial_ok: "The number of accepted partial resync requests",
		sync_partial_err: "The number of denied partial resync requests",
		expired_keys: "Total number of key expiration events",
		expired_stale_perc: "The percentage of keys probably expired",
		expired_time_cap_reached_count:
			"The count of times that active expiry cycles have stopped early",
		expire_cycle_cpu_milliseconds: "The cumulative amount of time spend on active expiry cycles",
		evicted_keys: "Number of evicted keys due to maxmemory limit",
		keyspace_hits: "Number of successful lookup of keys in the main dictionary",
		keyspace_misses: "Number of failed lookup of keys in the main dictionary",
		pubsub_channels: "Global number of pub/sub channels with client subscriptions",
		pubsub_patterns: "Global number of pub/sub pattern with client subscriptions",
		latest_fork_usec: "Duration of the latest fork operation in microseconds",
		migrate_cached_sockets: "The number of sockets open for MIGRATE purposes",
		slave_expires_tracked_keys:
			"The number of keys tracked for expiry purposes (applicable only to writable replicas)",
		active_defrag_hits:
			"Number of value reallocations performed by active the defragmentation process",
		active_defrag_misses:
			"Number of aborted value reallocations started by the active defragmentation process",
		active_defrag_key_hits: "Number of keys that were actively defragmented",
		active_defrag_key_misses:
			"Number of keys that were skipped by the active defragmentation process",
		tracking_total_keys: "Number of keys being tracked by the server",
		tracking_total_items:
			"Number of items, that is the sum of clients number for each key, that are being tracked",
		tracking_total_prefixes:
			"Number of tracked prefixes in server's prefix table (only applicable for broadcast mode)",
		unexpected_error_replies:
			"Number of unexpected error replies, that are types of errors from an AOF load or replication",
		total_reads_processed: "Total number of read events processed",
		total_writes_processed: "Total number of write events processed",
		io_threaded_reads_processed: "Number of read events processed by the main and I/O threads",
		io_threaded_writes_processed: "Number of write events processed by the main and I/O threads",
	},
	cpu: {
		used_cpu_sys: "System CPU consumed by the Redis server",
		used_cpu_user: "User CPU consumed by the Redis server",
		used_cpu_sys_children: "System CPU consumed by the background processes",
		used_cpu_user_children: "User CPU consumed by the background processes",
	},
};
</script>
