package untitled;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

import javax.script.ScriptContext;
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
        ScriptObjectMirror processFunction = eval(getResource("/init.js"), ctx);
        Object processObject = processFunction.call(processFunction, natives);
        ScriptObjectMirror nodeFunction = eval(getResource("/src/node.js"), ctx);
        nodeFunction.call(nodeFunction, processObject);
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
            return (ScriptObjectMirror) scriptEngine.eval(reader, ctx);
        }
    }

    private URL getResource(String name) {
        return getClass().getResource(name);
    }
}
