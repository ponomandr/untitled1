package untitled;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Process {
    public List<String> argv = new ArrayList<>();
    public Map<String, String> env = new HashMap<>();

    public String cwd() {
        return System.getProperty("user.dir");
    }
}
