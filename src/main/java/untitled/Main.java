package untitled;

import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.ScriptUtils;

import javax.script.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.Arrays.asList;
import static java.util.stream.Collectors.toMap;

public class Main {

    private final NashornScriptEngine scriptEngine = (NashornScriptEngine) new NashornScriptEngineFactory().getScriptEngine();

    public static void main(String[] args) throws Exception {
        Main main = new Main();
        main.run(args);
    }

    private void run(String[] args) throws IOException, ScriptException, URISyntaxException {
        Process process = new Process();
        process.argv.add("untitled");
        process.argv.addAll(asList(args));

        ScriptContext ctx = scriptEngine.getContext();
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("__NashornScriptEngine", scriptEngine);
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("__Main", this);
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("nativeModuleList", listNatives());
        ctx.getBindings(ScriptContext.ENGINE_SCOPE).put("PROCESS", process);
        URL resource = getClass().getResource("/init.js");
        try (Reader reader = new InputStreamReader(resource.openStream())) {
            scriptEngine.put(ScriptEngine.FILENAME, Paths.get(resource.getFile()).getFileName());
            Object o = scriptEngine.eval(reader, ctx);
        }
    }

    public List<String> listNatives() throws URISyntaxException, IOException {
        URI uri = getClass().getResource("/lib").toURI();
        Path libPath = uri.getScheme().equals("file") ?
                Paths.get(uri) :
                FileSystems.newFileSystem(uri, Collections.emptyMap()).getPath("/lib");
        try (DirectoryStream<Path> directoryStream = Files.newDirectoryStream(libPath)) {
            List<String> natives = new ArrayList<>();
            for (Path path : directoryStream) {
                String fileName = path.getFileName().toString();
                if (fileName.endsWith(".js")) {
                    natives.add(fileName);
                }
            }
            return natives;
        }
    }


    public Object runInContext(String script, Bindings context, String fileName) throws ScriptException {
        context.put("global", scriptEngine.getBindings(ScriptContext.ENGINE_SCOPE));
        scriptEngine.put(ScriptEngine.FILENAME, fileName);
        return ScriptUtils.unwrap(scriptEngine.eval(script, context));
    }

    public String readResource(String name) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(getClass().getResource(name).openStream()))) {
            return reader.lines().collect(Collectors.joining("\n"));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public URL getResource(String name) throws URISyntaxException {
        return getClass().getResource(name);
    }
//    private ScriptObjectMirror eval(URL resource, ScriptContext ctx) throws IOException, ScriptException {
//        try (Reader reader = new InputStreamReader(resource.openStream())) {
//            scriptEngine.put(ScriptEngine.FILENAME, Paths.get(resource.getFile()).getFileName());
//            Object o = scriptEngine.eval(reader, ctx);
//            return (ScriptObjectMirror) o;
//        }
//    }

}
