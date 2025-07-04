

const getArgs = () =>
    process.argv.reduce((args: any, arg: any) => {
        // long arg
        if (arg.slice(0, 2) === "--") {
            const longArg = arg.split("=");
            const longArgFlag = longArg[0].slice(2);
            const longArgValue = longArg.length > 1 ? longArg[1] : true;
            args[longArgFlag] = longArgValue;
        }
        // flags
        else if (arg[0] === "-") {
            const flags = arg.slice(1).split("");
            flags.forEach((flag: any) => {
                args[flag] = true;
            });
        }
        return args;
    }, {});



const getMode = (): any => {
    const args = getArgs();
    return args.agent_mode
}
 

export const agentMode: any = getMode() 

export function validateEnvironment(): void {
    try {

        const args = getArgs();
        const hasAgentMode = !!(args?.agent_mode)

        if (!hasAgentMode) {
            console.error(`❌ AGENT_MODE is not set. Use --agent_mode=<mode>`); 
            throw new Error('Agent mode is required');
        } else {
            console.error(`✅ Agent Mode: ${args.agent_mode}`);
        }
 
    } catch (error) {
        console.error('❌ Invalid environment configuration:', error);
        throw error;
    }
}

