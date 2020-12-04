<template>
	<div class="ui left demo vertical three item visible sidebar labeled icon menu">
		<router-link class="item" to="/">
			<i class="dashboard icon"></i>
			Dashboard
		</router-link>
		<router-link class="item" to="/allds">
			<i class="block layout icon"></i>
			Datasource
		</router-link>
		<a class="item" @click="showModalCreate">
			<i class="plus icon"></i>
			Create
		</a>
		<div class="ui basic modal" id="modal-create">
			<div class="ui icon header">
				<i class="plus square icon"></i>
				Create
				<br />
				<br />
				<div class="actions">
					<div
						class="ui green ok inverted button"
						style="width:200px"
						@click="$router.push({ name: 'Chart' })"
					>
						Create new board
					</div>
					<div
						class="ui green ok inverted button"
						style="width:200px"
						@click="$router.push({ name: 'Datasource' })"
					>
						Create new datasource
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	methods: {
		showModalCreate() {
			$("#modal-create").modal("show");
		},
	},
};
</script>
