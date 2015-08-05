package untitled;

import jdk.nashorn.api.scripting.ScriptObjectMirror;

import java.nio.ByteBuffer;

public class Smalloc {
    public static final int kMaxLength = 0x3fffffff;


    public static Object alloc(ScriptObjectMirror obj, int n, ScriptObjectMirror type) {
        System.out.println("smalloc.alloc: obj = [" + obj + "], n = [" + n + "], type = [" + type + "]");
        throw new UnsupportedOperationException("not implemented yet");
    }

    public static Object alloc(ScriptObjectMirror obj, int n) {
        System.out.println("smalloc.alloc: obj = [" + obj + "], n = [" + n + "]");
        ByteBuffer buf = ByteBuffer.allocate(n);
        obj.setIndexedPropertiesToExternalArrayData(buf);
        obj.put("_internal_buffer", buf);
        return obj;
    }

    public static void dispose(ScriptObjectMirror obj) {
        System.out.println("smalloc.dispose: " + obj);
        throw new UnsupportedOperationException("not implemented yet");
    }

    public static void truncate(ScriptObjectMirror obj) {
        System.out.println("smalloc.truncate");
        throw new UnsupportedOperationException("not implemented yet");
    }


    public static void copyOnto(Object source, Object source_start, Object dest, Object dest_start, Object copy_length) {
        System.out.println("smalloc.copyOnto");
        System.out.println("source = [" + source + "], source_start = [" + source_start + "], dest = [" + dest + "], dest_start = [" + dest_start + "], copy_length = [" + copy_length + "]");
        throw new UnsupportedOperationException("not implemented yet");
    }

    public static Object sliceOnto(ScriptObjectMirror source, ScriptObjectMirror dest, int start, int end) {
        Object _buffer = source.get("_internal_buffer");
        if (_buffer instanceof ByteBuffer) {
            ByteBuffer byteBuffer = (ByteBuffer) _buffer;
            int pos = byteBuffer.position();
            try {
                byteBuffer.position(0);
                ByteBuffer slice = byteBuffer.slice();
                slice.position(start);
                slice.limit(end - start);
                dest.setIndexedPropertiesToExternalArrayData(slice);
                dest.put("_internal_buffer", slice);
            } finally {
                byteBuffer.position(pos);
            }
        }
        return source;
    }

}
