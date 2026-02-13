module.exports = {
	apps: [
		{
			name: "Aero Frontend",
			script: "npm",
			args: "start",
		},
		{
			name: "Aero Backend",
			interpreter: "python3",
			script: "main.py",
			cwd: "backend",
		},
	],
};
