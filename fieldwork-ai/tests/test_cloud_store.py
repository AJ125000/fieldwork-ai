"""Cloud JSON preserves nested outlines and reads legacy Firestore documents."""
from types import SimpleNamespace
from fieldwork.store import CloudStore

class FakeDB:
    def __init__(self):
        self.docs = {}
    def collection(self, kind):
        db = self
        class Collection:
            def document(self, key):
                class Document:
                    def set(self, value):
                        assert set(value) == {"_fieldwork_json_v1"}
                        assert isinstance(value["_fieldwork_json_v1"], str)
                        db.docs[(kind, key)] = value
                    def get(self):
                        value = db.docs.get((kind, key))
                        return SimpleNamespace(exists=value is not None, to_dict=lambda: value)
                return Document()
            def stream(self):
                return [SimpleNamespace(to_dict=lambda v=v: v) for (k, _), v in db.docs.items() if k == kind]
        return Collection()

def test_nested_outlines_roundtrip_and_legacy_documents():
    store = object.__new__(CloudStore)
    store.db = FakeDB()
    payload = {"capture_coverage": {"views": [{"garment_outline": [[10, 20], [30, 40]]}]}, "note": "₹ नमस्ते"}
    store.put_json("listings", "new", payload)
    store.db.docs[("listings", "old")] = {"id": "old", "price": 400}
    assert store.get_json("listings", "new") == payload
    assert store.get_json("listings", "old") == {"id": "old", "price": 400}
    assert store.list_json("listings") == [payload, {"id": "old", "price": 400}]
    assert store.get_json("listings", "missing") is None
