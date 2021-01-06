# Getting Started

## Create new datasource
* Choose **Create**/**Create new datasource**

![Create Datasource](/dashboard/docs/pictures/createds.png)

* Choose type of datasource. It can be JSON, Jmx, Redis or Fixed Value 
* Insert name of datasource, name of datasource is unique

::: tip JSON type
In json datasource type: You can change request method or add header/body,... and the path to the value

Example
```json{6}
{
  "data": [
    {
      "address": {
        "streetName": "Johnson Roads",
        "buildingNumber": "271",
        "city": "New Spencer",
      },
    }
  ]
}
```
path: data/0/address/buildingNumber return the value of buildingAddress
:::
* Insert required fields and click **Submit**. Or you can Test the datasource first to make sure it's work by click **Test**

## Create new Chart
* Choose **Create**/**Custom chart**

![Create Chart](/dashboard/docs/pictures/createchart.png)

* Enter chart name 
* Enter chart type. Now Dashboard supports 3 types of chart: table, pie and line
* Enter interval time. Every n miliseconds, datasources that this chart uses will be updated
* Add field to the chart. Name of the datasource you want to present in this chart and the name of the datasource to reference.
* After add some fileds to this chart. Click Submit to create chart

## Edit chart
* In main screen, click pencil button on right top of the chart to edit.

![Edit Chart](/dashboard/docs/pictures/edit.png)

## Edit datasource
* Click **Datasource** in navbar

![Datasources](/dashboard/docs/pictures/datasources.png)

* Click **Edit** to edit the datasource

## Arrange chart
* In main screen, click and hold arrows button then drag and drop to arrange charts.

## ActiveMQ and Redis stuff :tada: :100:
* Click **Create**/**ActiveMQ|Redis**

![Redis](/dashboard/docs/pictures/redis.png)

* Choose attribures you want
* Click **Create datasource** to create datasource based on attribute you chose. You can use these datasources in other chart
* Or you can Enter the name of chart then click **Add to chart** to add these datasources to this chart
::: tip Add to chart
Insert new chart name and enter or choose exist chart
:::

::: tip With ActimeMQ
Enter Jmx url then click **Show** to show all available attribute. Then do the same step above
:::
