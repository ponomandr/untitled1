package untitled;

import jdk.nashorn.api.scripting.ScriptObjectMirror;
import jdk.nashorn.api.scripting.ScriptUtils;

import java.nio.ByteBuffer;

public class Smalloc {
    public static final int kMaxLength = 0x3fffffff;


    public static Object alloc(ScriptObjectMirror obj, int n, ScriptObjectMirror type) {
        System.out.println("smalloc.alloc: obj = [" + obj + "], n = [" + n + "], type = [" + type + "]");
        return new Object();
    }

    public static Object alloc(ScriptObjectMirror obj, int n) {
        System.out.println("smalloc.alloc: obj = [" + obj + "], n = [" + n + "]");
        obj.setIndexedPropertiesToExternalArrayData(ByteBuffer.allocate(n));
        return obj;
    }

    public static void dispose(ScriptObjectMirror obj) {
        System.out.println("smalloc.dispose: " + obj);
    }

    public static void truncate(ScriptObjectMirror obj) {
        System.out.println("smalloc.truncate");
    }


    public static void copyOnto(Object source, Object source_start, Object dest, Object dest_start, Object copy_length) {
        System.out.println("smalloc.copyOnto");
        System.out.println("source = [" + source + "], source_start = [" + source_start + "], dest = [" + dest + "], dest_start = [" + dest_start + "], copy_length = [" + copy_length + "]");
    }

    public static Object sliceOnto(ScriptObjectMirror source, ScriptObjectMirror dest, Object start, Object end) {
        System.out.println("smalloc.sliceOnto");
        System.out.println("source = [" + source + "], dest = [" + dest + "], start = [" + start + "], end = [" + end + "]");
        return new Object();
    }

}
