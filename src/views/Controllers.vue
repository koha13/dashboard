<template>
	<div class="ui centered grid" style="width:100%;margin:0;padding:10px">
		<div class="row">
			<table
				class="ui selectable celled small table"
				style="padding:0;box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);"
			>
				<thead>
					<tr>
						<th colspan="7">
							All connectors
						</th>
					</tr>
					<tr>
						<th>Name</th>
						<th>ActiveMQ Url</th>
						<th>Option</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td
							colspan="3"
							style="text-align:center"
							v-if="$store.getters.allControllers.length == 0"
						>
							Create new controller
							<router-link tag="button" to="/create" class="mini green ui icon button">
								<i class="icon plus square"></i>
							</router-link>
						</td>
					</tr>
					<tr v-for="con in $store.getters.allControllers" :key="con.url">
						<td>{{ con.name }}</td>
						<td>{{ con.url }}</td>
						<td>
							<router-link
								:to="{
									name: 'AMQControlerDetail',
									query: { url: con.url },
								}"
								tag="button"
								class="ui mini green button"
								>Control</router-link
							>
							<button
								class="ui mini negative button"
								@click="$store.commit('deleteController', con.name)"
							>
								Delete
							</button>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</template>

<script>
export default {};
</script>

<style></style>
