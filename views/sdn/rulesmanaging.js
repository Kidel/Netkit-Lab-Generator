let rulesDiv = new Vue({
	el: '#details2',
	data: {
		visible: false,

		device: null,
		packetRules: [],
		labelRules: []
	},
	methods: {
		open: function(device){
			this.visible = true
			this.device = device
			
			let rules = sdnData.getDeviceRules(device)
			if(rules){
				this.packetRules = rules.filter(rule => !rule.matches.some(match => match.label))
				this.labelRules = rules.filter(rule => !this.packetRules.includes(rule))
			}
			
			fillRulesSVG(this.packetRules.concat(this.labelRules))
		},

		close: function(){
			this.visible = false
			this.device = null
			this.packetRules = []
			this.labelRules = []
		},

		popupModal: function(){
			ruleModal.open(this.device)
		}
	},
	components: {
		'rule-match-action': {
			props: ['name', 'value', 'label'],
			template:
			// TODO: Volevo aggiungere un <hr> ma mi divide in 2 il <p>
			// .... MA! Posso provare a metter un div come root
				'<p>' +
					'<span v-if="label" class="colorTag" ' +
						'v-bind:style="{ backgroundColor: label.color }">' +
					'</span>' +
					'<span v-else>{{ name }} </span>' +
					'{{ value }}' +
				'</p>'
		},
	}
})

/* -------------- SVG -------------- */

function fillRulesSVG(rulesData) {
	let svg = d3.select('#details2 svg')
	svg.node().innerHTML = ""
	let padding = 45
    let width = svg.attr('width') - padding
    let height = svg.attr('height') - padding

    let counter = 1
    let data = rulesData.map(function(el){ return { num: counter++, stats: el.stats }})

    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0])
 
    let g = svg.append("g")
        .attr("transform", "translate(20, 5)")

    x.domain(data.map(function (d) { return d.num }))
    y.domain([0, d3.max(data, function (d) { return d.stats })])

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + (height + 5) + ")")
        .call(d3.axisBottom(x))

    g.append("g")
        .attr("class", "y-axis")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("text-anchor", "end")
        .text("stats")

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr('class', 'bar')
        .attr("x", function (d) { return x(d.num) })
        .attr("y", function (d) { return y(d.stats) })
        .attr("width", x.bandwidth())
        .attr("height", function (d) { return height - y(d.stats) })
}