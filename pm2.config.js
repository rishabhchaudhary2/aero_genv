module.exports = {
	apps: [
		{
			name: 'Frontend',
			script: 'npm',
			args: 'start',
		},
		{
			name: 'Backend',
			interpreter: 'python3',
			script: 'main.py',
			cwd: '/home/ubuntu/aero_genv/backend',
		}
	],
};