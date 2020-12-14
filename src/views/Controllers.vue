<template>
	<div class="ui grid" style="padding: 20px">
		<table class="ui selectable celled small table" style="padding:0;box-shadow: 3px 3px 10px;">
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
							class="ui mini primary button"
							>Control</router-link
						>
						<button
							class="ui mini negative button"
							@click="$store.commit('deleteController', con.url)"
						>
							Delete
						</button>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<script>
export default {};
</script>

<style></style>
