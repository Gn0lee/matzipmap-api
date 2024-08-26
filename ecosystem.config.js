module.exports = {
	apps: [
		{
			name: 'matzipmap-api',
			script: '/home/jinho605/matzipmap/be/index.js',
			instances: 'max',
			exec_mode: 'cluster',
			watch: true,
			env: {
				NODE_ENV: 'development',
			},
			env_production: {
				NODE_ENV: 'production',
			},
		},
	],
};
