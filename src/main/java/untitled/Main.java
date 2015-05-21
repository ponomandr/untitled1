package untitled;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

import javax.script.Bindings;
import javax.script.ScriptContext;
import javax.script.ScriptEngine;
import javax.script.ScriptException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URL;
import java.util.Map;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;

public class Main {

    private final NashornScriptEngine scriptEngine = (NashornScriptEngine) new NashornScriptEngineFactory().getScriptEngine();
    private final Map<String, String> natives;

    public Main() throws IOException {
        natives = loadNatives();
    }

    public static void main(String[] args) throws Exception {
        Main main = new Main();
        main.run();
    }

    private void run() throws IOException, ScriptException {
        ScriptContext ctx = scriptEngine.getContext();
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("__NashornScriptEngine", scriptEngine);
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("__Main", this);
        ScriptObjectMirror processFunction = eval(getResource("/init.js"), ctx);
        Object processObject = processFunction.call(processFunction, natives);
        ScriptObjectMirror nodeFunction = eval(getResource("/src/node.js"), ctx);
        nodeFunction.call(nodeFunction, processObject);
    }


    public void runInContext(String script, Bindings context, String fileName) throws ScriptException {
        context.put("global", scriptEngine.getBindings(ScriptContext.ENGINE_SCOPE));
        scriptEngine.put(ScriptEngine.FILENAME, fileName);
        scriptEngine.eval(script, context);
    }

    private Map<String, String> loadNatives() throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(getResource("/lib/").openStream()))) {
            return reader.lines()
                    .filter(fileName -> fileName.endsWith(".js"))
                    .collect(toMap(name -> name.substring(0, name.length() - 3), this::readNativeModule));
        }
    }

    private String readNativeModule(String fileName) {
        URL resource = getResource("/lib/" + fileName);
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.openStream()))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private ScriptObjectMirror eval(URL resource, ScriptContext ctx) throws IOException, ScriptException {
        try (Reader reader = new InputStreamReader(resource.openStream())) {
            scriptEngine.put(ScriptEngine.FILENAME, resource.getFile());
            return (ScriptObjectMirror) scriptEngine.eval(reader, ctx);
        }
    }

    private URL getResource(String name) {
        return getClass().getResource(name);
    }
}
